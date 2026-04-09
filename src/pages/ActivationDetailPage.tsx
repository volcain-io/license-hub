import { useParams, Link } from 'react-router-dom';
import { useStoreData } from '@/hooks/use-store-sync';
import * as store from '@/lib/store';
import { getAuditLogsByLicense } from '@/lib/audit-store';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Monitor, Shield, Clock, Globe, Hash, FileText, ShieldCheck, ShieldBan, Copy, Cpu, Box, Timer, Zap, Tag } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useDevMode } from '@/contexts/DevModeContext';

const resultColors: Record<string, string> = {
  approved: 'bg-success/15 text-success border-success/30',
  denied: 'bg-destructive/15 text-destructive border-destructive/30',
  error: 'bg-warning/15 text-warning border-warning/30',
};

const stateColors: Record<string, string> = {
  activated: 'bg-success/15 text-success border-success/30',
  reactivated: 'bg-success/15 text-success border-success/30',
  deactivated: 'bg-muted text-muted-foreground',
  suspended: 'bg-warning/15 text-warning border-warning/30',
  revoked: 'bg-destructive/15 text-destructive border-destructive/30',
  expired: 'bg-muted text-muted-foreground',
};

export default function ActivationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { activations, grants, licenses, products, responseLogs, historyLogs } = useStoreData();
  const { devMode } = useDevMode();

  const activation = activations.find(a => a.id === id);
  if (!activation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg mb-4">Activation not found</p>
        <Button variant="outline" asChild><Link to="/activations"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Activations</Link></Button>
      </div>
    );
  }

  const grant = grants.find(g => g.id === activation.grantId);
  const license = licenses.find(l => l.id === activation.licenseId);
  const product = license ? products.find(p => p.id === license.productId) : null;

  const actResponseLogs = responseLogs.filter(r => r.activationId === activation.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const actHistoryLogs = historyLogs.filter(h => h.activationId === activation.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const auditLog = license ? getAuditLogsByLicense(license.id).filter(e => e.details.toLowerCase().includes(activation.deviceName.toLowerCase())) : [];

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/activations"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Activations</Link>
        </Button>
      </div>

      <PageHeader
        title={activation.deviceName}
        description="Activation detail — response logs, history & audit trail"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { store.updateActivation(activation.id, { isActive: !activation.isActive }); toast.success(activation.isActive ? 'Denied' : 'Allowed'); }}>
              {activation.isActive ? <><ShieldBan className="h-4 w-4 mr-1" /> Deny</> : <><ShieldCheck className="h-4 w-4 mr-1" /> Allow</>}
            </Button>
            {devMode && <>
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(activation.systemId); toast.success('System ID copied'); }}>
                <Copy className="h-4 w-4 mr-1" /> Copy System ID
              </Button>
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`DEV-${activation.systemId}-${activation.deviceFingerprint}`); toast.success('Developer Info System ID copied'); }}>
                <Copy className="h-4 w-4 mr-1" /> Copy Dev Info ID
              </Button>
            </>}
            <Badge variant="outline" className={cn('text-xs', activation.isActive ? 'bg-success/15 text-success border-success/30' : 'bg-destructive/15 text-destructive border-destructive/30')}>
              {activation.isActive ? 'Allowed' : 'Denied'}
            </Badge>
          </div>
        }
      />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">System Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={Hash} label="System ID"><span className="font-mono text-xs">{activation.systemId}</span></InfoRow>
            <InfoRow icon={Monitor} label="Device">{activation.deviceName}</InfoRow>
            <InfoRow icon={Hash} label="Fingerprint"><span className="font-mono text-xs">{activation.deviceFingerprint}</span></InfoRow>
            <InfoRow icon={Globe} label="IP Address"><span className="font-mono text-xs">{activation.ipAddress}</span></InfoRow>
            <InfoRow icon={Box} label="Install Type"><Badge variant="secondary" className="text-xs">{activation.installationType}</Badge></InfoRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Activation Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={Cpu} label="Product Family">{activation.productFamily}</InfoRow>
            <InfoRow icon={Tag} label="Version"><span className="font-mono text-xs">{activation.productVersion}</span></InfoRow>
            <InfoRow icon={Zap} label="Act. Type"><Badge variant="secondary" className="text-xs">{activation.activationType}</Badge></InfoRow>
            <InfoRow icon={Timer} label="Interval">{activation.interval} min</InfoRow>
            <InfoRow icon={Shield} label="Last State">
              <Badge variant="outline" className={cn('text-xs',
                activation.lastProductActivationState === 'activated' ? 'bg-success/15 text-success border-success/30' :
                activation.lastProductActivationState === 'deactivated' ? 'bg-destructive/15 text-destructive border-destructive/30' :
                activation.lastProductActivationState === 'pending' ? 'bg-warning/15 text-warning border-warning/30' :
                'bg-muted text-muted-foreground'
              )}>{activation.lastProductActivationState}</Badge>
            </InfoRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Grant & License</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={Shield} label="Grant">{grant?.name || 'Unknown'}</InfoRow>
            <InfoRow icon={FileText} label="Type"><Badge variant="secondary" className="text-xs">{grant?.grantType === 'main_license' ? 'Main License' : 'Sublicense'}</Badge></InfoRow>
            <InfoRow icon={FileText} label="Identity"><Badge variant="secondary" className="text-xs">{grant?.grantIdentity || '—'}</Badge></InfoRow>
            <InfoRow icon={FileText} label="License">
              {license ? <Link to={`/licenses/${license.id}`} className="text-primary hover:underline text-xs font-mono">{license.licenseKey}</Link> : 'Unknown'}
            </InfoRow>
            <InfoRow icon={FileText} label="Customer">{license?.customerName || '—'}</InfoRow>
            <InfoRow icon={Clock} label="Activated">{format(new Date(activation.activatedAt), 'MMM d, yyyy HH:mm')}</InfoRow>
            <InfoRow icon={Clock} label="Last Call">
              {format(new Date(activation.lastActivationCall), 'MMM d, yyyy HH:mm')}
              <span className="text-xs text-muted-foreground ml-1">({formatDistanceToNow(new Date(activation.lastActivationCall), { addSuffix: true })})</span>
            </InfoRow>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for logs */}
      <Tabs defaultValue="response" className="space-y-4">
        <TabsList>
          <TabsTrigger value="response">Response Logs ({actResponseLogs.length})</TabsTrigger>
          <TabsTrigger value="history">History ({actHistoryLogs.length})</TabsTrigger>
          <TabsTrigger value="audit">Audit Log ({auditLog.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="response">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Result</TableHead>
                    <TableHead>Reason Code</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actResponseLogs.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs', resultColors[r.result] || '')}>{r.result}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.reasonCode}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-md">{r.details}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(r.timestamp), 'MMM d, yyyy HH:mm:ss')}</TableCell>
                    </TableRow>
                  ))}
                  {actResponseLogs.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No response logs</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transition</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actHistoryLogs.map(h => (
                    <TableRow key={h.id}>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {h.fromState && <span className="text-xs text-muted-foreground">{h.fromState}</span>}
                          {h.fromState && <span className="text-xs text-muted-foreground">→</span>}
                          <Badge variant="outline" className={cn('text-xs', stateColors[h.toState] || '')}>{h.toState}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{h.reason}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{h.performedBy}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(h.timestamp), 'MMM d, yyyy HH:mm')}</TableCell>
                    </TableRow>
                  ))}
                  {actHistoryLogs.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No history logs</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {auditLog.map(entry => (
                  <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="text-lg mt-0.5">📋</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{entry.details}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm')}</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="text-xs text-muted-foreground">{entry.performedBy}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">{entry.action}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {auditLog.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">No audit entries for this device</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function InfoRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}
