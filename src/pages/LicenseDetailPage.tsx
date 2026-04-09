import { useParams, Link } from 'react-router-dom';
import { useStoreData } from '@/hooks/use-store-sync';
import * as store from '@/lib/store';
import { getAuditLogsByLicense } from '@/lib/audit-store';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, ShieldCheck, ShieldBan, Eye, User, Mail, Package, Key, Clock, Hash, FileText, Shield, Filter, Power, PowerOff, Plus, Fingerprint } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import type { Activation, Grant as GrantType } from '@/lib/types';

const actionIcons: Record<string, string> = {
  'license.created': '🆕', 'license.updated': '✏️', 'license.renewed': '🔄',
  'license.expired': '⏰', 'license.suspended': '⚠️', 'license.revoked': '🚫',
  'activation.added': '📱', 'activation.deactivated': '📴', 'activation.removed': '🗑️',
};

const grantStateColor: Record<string, string> = {
  active: 'bg-success/15 text-success border-success/30',
  inactive: 'bg-muted text-muted-foreground',
};

const grantUsageColor: Record<string, string> = {
  usable: 'bg-success/15 text-success border-success/30',
  unusable: 'bg-destructive/15 text-destructive border-destructive/30',
};

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

export default function LicenseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, licenses, grants, activations, responseLogs, historyLogs } = useStoreData();
  const [selectedGrantId, setSelectedGrantId] = useState<string>('all');

  const license = licenses.find(l => l.id === id);
  if (!license) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg mb-4">License not found</p>
        <Button variant="outline" asChild><Link to="/licenses"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Licenses</Link></Button>
      </div>
    );
  }

  const product = products.find(p => p.id === license.productId);
  const licenseGrants = grants.filter(g => g.licenseId === license.id);
  const licenseActivations = activations.filter(a => a.licenseId === license.id);
  const activeCount = licenseActivations.filter(a => a.isActive).length;
  const auditLog = getAuditLogsByLicense(license.id);

  // Filtered data based on selected grant
  const filteredActivations = selectedGrantId === 'all'
    ? licenseActivations
    : licenseActivations.filter(a => a.grantId === selectedGrantId);

  const filteredActivationIds = new Set(filteredActivations.map(a => a.id));

  const filteredResponseLogs = responseLogs
    .filter(r => filteredActivationIds.has(r.activationId))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const filteredHistoryLogs = historyLogs
    .filter(h => filteredActivationIds.has(h.activationId))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const selectedGrant = licenseGrants.find(g => g.id === selectedGrantId);
  const filteredAuditLog = selectedGrantId === 'all'
    ? auditLog
    : auditLog.filter(e => e.details.toLowerCase().includes(selectedGrantId.toLowerCase()) || e.details.toLowerCase().includes(selectedGrant?.name?.toLowerCase() || '___'));

  const copyKey = () => { navigator.clipboard.writeText(license.licenseKey); toast.success('Key copied'); };
  const toggleActive = (a: Activation) => {
    store.updateActivation(a.id, { isActive: !a.isActive });
    toast.success(a.isActive ? 'Denied' : 'Allowed');
  };

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/licenses"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Licenses</Link>
        </Button>
      </div>

      <PageHeader title={license.customerName} description="License detail — grants, activations & audit log" actions={<StatusBadge status={license.status} />} />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">License Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={Key} label="License Key">
              <span className="font-mono text-xs">{license.licenseKey}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={copyKey}><Copy className="h-3 w-3" /></Button>
            </InfoRow>
            <InfoRow icon={Package} label="Product">{product?.name || 'Unknown'}</InfoRow>
            <InfoRow icon={User} label="Customer">{license.customerName}</InfoRow>
            <InfoRow icon={Mail} label="Email">{license.customerEmail}</InfoRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Usage & Dates</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={Shield} label="Grants">{licenseGrants.length}</InfoRow>
            <InfoRow icon={Hash} label="Activations">
              <span className={cn(activeCount >= license.maxActivations ? 'text-destructive font-semibold' : '')}>
                {activeCount} / {license.maxActivations}
              </span>
            </InfoRow>
            <InfoRow icon={Clock} label="Created">{format(new Date(license.createdAt), 'MMM d, yyyy')}</InfoRow>
            <InfoRow icon={Clock} label="Expires">
              {license.expiresAt ? (
                <span>{format(new Date(license.expiresAt), 'MMM d, yyyy')} <span className="text-muted-foreground text-xs">({formatDistanceToNow(new Date(license.expiresAt), { addSuffix: true })})</span></span>
              ) : 'Never (lifetime)'}
            </InfoRow>
            {license.notes && <InfoRow icon={FileText} label="Notes">{license.notes}</InfoRow>}
          </CardContent>
        </Card>
      </div>

      {/* Grants */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Grants ({licenseGrants.length})</h2>
        {licenseGrants.some(g => g.grantState === 'active') && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              licenseGrants.forEach(g => {
                if (g.grantState === 'active') {
                  store.updateGrant(g.id, { grantState: 'inactive' });
                }
              });
              toast.success(`All active grants deactivated`);
            }}
          >
            <PowerOff className="h-4 w-4 mr-1" />
            Deactivate All Grants
          </Button>
        )}
      </div>
      <Card className="mb-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Identity</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>State</TableHead>
                <TableHead>License Key</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="w-48" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenseGrants.map(g => (
                <TableRow
                  key={g.id}
                  className={cn('cursor-pointer', selectedGrantId === g.id && 'bg-accent')}
                  onClick={() => setSelectedGrantId(prev => prev === g.id ? 'all' : g.id)}
                >
                  <TableCell className="font-medium text-sm">
                    <div className="flex items-center gap-2">
                      {selectedGrantId === g.id && <Filter className="h-3 w-3 text-primary" />}
                      {g.name}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{g.grantType === 'main_license' ? 'Main License' : 'Sublicense'}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-xs capitalize">{g.grantIdentity}</Badge></TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', grantUsageColor[g.usageStatus] || '')}>
                      {g.usageStatus === 'usable' ? 'Usable' : 'Unusable'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', grantStateColor[g.grantState] || '')}>
                      {g.grantState === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{g.licenseKey}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(g.startDate), 'MMM d, yyyy')} → {g.endDate ? format(new Date(g.endDate), 'MMM d, yyyy') : '∞'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" title={g.grantState === 'active' ? 'Deactivate' : 'Activate'} onClick={() => {
                        store.updateGrant(g.id, { grantState: g.grantState === 'active' ? 'inactive' : 'active' });
                        toast.success(g.grantState === 'active' ? 'Grant deactivated' : 'Grant activated');
                      }}>
                        {g.grantState === 'active' ? <PowerOff className="h-4 w-4 text-destructive" /> : <Power className="h-4 w-4 text-success" />}
                      </Button>
                      <Button variant="ghost" size="icon" title="Add Sublicense" onClick={() => {
                        store.createGrant({ licenseId: g.licenseId, usageStatus: 'usable', licenseKey: g.licenseKey, name: `${g.name} - Sublicense`, grantType: 'sublicense', grantIdentity: g.grantIdentity, grantState: 'active', startDate: new Date().toISOString(), endDate: g.endDate });
                        toast.success('Sublicense added');
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Manually Activate" onClick={() => {
                        store.updateGrant(g.id, { grantState: 'active', usageStatus: 'usable' });
                        toast.success('Grant manually activated');
                      }}>
                        <Fingerprint className="h-4 w-4 text-primary" />
                      </Button>
                      {/* Developer-only actions */}
                      <Button variant="ghost" size="icon" title="Copy Grant ID (Dev)" onClick={() => { navigator.clipboard.writeText(g.id); toast.success('Grant ID copied'); }}>
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Copy License ID (Dev)" onClick={() => { navigator.clipboard.writeText(g.licenseId); toast.success('License ID copied'); }}>
                        <Key className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {licenseGrants.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No grants</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Grant Filter Indicator + Tabs */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">
          {selectedGrantId === 'all' ? 'All Activity' : `Filtered by: ${selectedGrant?.name}`}
        </h2>
        {selectedGrantId !== 'all' && (
          <Button variant="outline" size="sm" onClick={() => setSelectedGrantId('all')}>
            Clear filter
          </Button>
        )}
      </div>

      <Tabs defaultValue="activations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activations">Activations ({filteredActivations.length})</TabsTrigger>
          <TabsTrigger value="response">Response Logs ({filteredResponseLogs.length})</TabsTrigger>
          <TabsTrigger value="history">History ({filteredHistoryLogs.length})</TabsTrigger>
          <TabsTrigger value="audit">Audit Log ({filteredAuditLog.length})</TabsTrigger>
        </TabsList>

        {/* Activations Tab */}
        <TabsContent value="activations">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>System ID</TableHead>
                    <TableHead>Grant</TableHead>
                    <TableHead>Install Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Call</TableHead>
                    <TableHead>Last State</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-36" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivations.map(a => {
                    const grant = grants.find(g => g.id === a.grantId);
                    return (
                      <TableRow key={a.id}>
                        <TableCell>
                          <div className="font-medium text-sm">{a.deviceName}</div>
                          <div className="font-mono text-xs text-muted-foreground">{a.deviceFingerprint}</div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{a.systemId}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{grant?.name || 'Unknown'}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{a.installationType}</Badge></TableCell>
                        <TableCell className="font-mono text-xs">{a.productVersion}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{format(new Date(a.lastActivationCall), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs',
                            a.lastProductActivationState === 'activated' ? 'bg-success/15 text-success border-success/30' :
                            a.lastProductActivationState === 'deactivated' ? 'bg-destructive/15 text-destructive border-destructive/30' :
                            'bg-muted text-muted-foreground'
                          )}>{a.lastProductActivationState}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{a.ipAddress}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs', a.isActive ? 'bg-success/15 text-success border-success/30' : 'bg-destructive/15 text-destructive border-destructive/30')}>
                            {a.isActive ? 'Allowed' : 'Denied'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" asChild><Link to={`/activations/${a.id}`}><Eye className="h-4 w-4" /></Link></Button>
                            <Button variant="ghost" size="icon" onClick={() => toggleActive(a)} title={a.isActive ? 'Deny' : 'Allow'}>
                              {a.isActive ? <ShieldBan className="h-4 w-4 text-destructive" /> : <ShieldCheck className="h-4 w-4 text-success" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(a.systemId); toast.success('System ID copied'); }} title="Copy System ID">
                              <Copy className="h-4 w-4" />
                            </Button>
                            
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredActivations.length === 0 && (
                    <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No activations</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Logs Tab */}
        <TabsContent value="response">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Reason Code</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponseLogs.map(r => {
                    const act = activations.find(a => a.id === r.activationId);
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="text-sm font-medium">{act?.deviceName || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs', resultColors[r.result] || '')}>{r.result}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{r.reasonCode}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{r.details}</TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(r.timestamp), 'MMM d, yyyy HH:mm:ss')}</TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredResponseLogs.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No response logs</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Transition</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistoryLogs.map(h => {
                    const act = activations.find(a => a.id === h.activationId);
                    return (
                      <TableRow key={h.id}>
                        <TableCell className="text-sm font-medium">{act?.deviceName || '—'}</TableCell>
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
                    );
                  })}
                  {filteredHistoryLogs.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No history logs</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredAuditLog.map(entry => (
                  <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="text-lg mt-0.5">{actionIcons[entry.action] || '📋'}</span>
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
                {filteredAuditLog.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">No audit entries</div>
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
