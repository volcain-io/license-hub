import { useParams, Link } from 'react-router-dom';
import { useStoreData } from '@/hooks/use-store-sync';
import * as store from '@/lib/store';
import { getAuditLogsByLicense } from '@/lib/audit-store';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Copy, Power, PowerOff, Trash2, Eye, User, Mail, Package, Key, Clock, Hash, FileText, Shield } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { Activation, Grant as GrantType } from '@/lib/types';

const actionIcons: Record<string, string> = {
  'license.created': '🆕', 'license.updated': '✏️', 'license.renewed': '🔄',
  'license.expired': '⏰', 'license.suspended': '⚠️', 'license.revoked': '🚫',
  'activation.added': '📱', 'activation.deactivated': '📴', 'activation.removed': '🗑️',
};

const grantStatusColor: Record<string, string> = {
  active: 'bg-success/15 text-success border-success/30',
  expired: 'bg-muted text-muted-foreground',
  revoked: 'bg-destructive/15 text-destructive border-destructive/30',
};

export default function LicenseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, licenses, grants, activations } = useStoreData();
  const [deleteTarget, setDeleteTarget] = useState<Activation | null>(null);
  const [deleteGrantTarget, setDeleteGrantTarget] = useState<GrantType | null>(null);

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

  const copyKey = () => { navigator.clipboard.writeText(license.licenseKey); toast.success('Key copied'); };
  const toggleActive = (a: Activation) => {
    store.updateActivation(a.id, { isActive: !a.isActive });
    toast.success(a.isActive ? 'Deactivated' : 'Reactivated');
  };
  const handleDeleteActivation = () => {
    if (deleteTarget) { store.deleteActivation(deleteTarget.id); toast.success('Activation removed'); }
    setDeleteTarget(null);
  };
  const handleDeleteGrant = () => {
    if (deleteGrantTarget) { store.deleteGrant(deleteGrantTarget.id); toast.success('Grant removed'); }
    setDeleteGrantTarget(null);
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
      <h2 className="text-lg font-semibold mb-3">Grants ({licenseGrants.length})</h2>
      <Card className="mb-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Feature Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activations</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenseGrants.map(g => {
                const grantActivations = activations.filter(a => a.grantId === g.id);
                const grantActiveCount = grantActivations.filter(a => a.isActive).length;
                return (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium text-sm">{g.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{g.featureCode}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs', grantStatusColor[g.status] || '')}>
                        {g.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{grantActiveCount} / {g.maxActivations}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(g.startsAt), 'MMM d, yyyy')} → {g.expiresAt ? format(new Date(g.expiresAt), 'MMM d, yyyy') : '∞'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteGrantTarget(g)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {licenseGrants.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No grants</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Activations */}
      <h2 className="text-lg font-semibold mb-3">Activations ({licenseActivations.length})</h2>
      <Card className="mb-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Grant</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Activated</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenseActivations.map(a => {
                const grant = grants.find(g => g.id === a.grantId);
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{a.deviceName}</div>
                      <div className="font-mono text-xs text-muted-foreground">{a.deviceFingerprint}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{grant?.name || 'Unknown'}</TableCell>
                    <TableCell className="font-mono text-xs">{a.ipAddress}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(a.activatedAt), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(a.lastSeenAt), 'MMM d, yyyy')}
                      <span className="text-xs ml-1">({formatDistanceToNow(new Date(a.lastSeenAt), { addSuffix: true })})</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs', a.isActive ? 'bg-success/15 text-success border-success/30' : 'bg-muted text-muted-foreground')}>
                        {a.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild><Link to={`/activations/${a.id}`}><Eye className="h-4 w-4" /></Link></Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleActive(a)} title={a.isActive ? 'Deactivate' : 'Reactivate'}>
                          {a.isActive ? <PowerOff className="h-4 w-4 text-warning" /> : <Power className="h-4 w-4 text-success" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(a)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {licenseActivations.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No activations yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <h2 className="text-lg font-semibold mb-3">Audit Log</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {auditLog.map(entry => (
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
            {auditLog.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">No audit entries</div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Remove Activation" description={`Remove activation for "${deleteTarget?.deviceName}"?`} onConfirm={handleDeleteActivation} />
      <ConfirmDialog open={!!deleteGrantTarget} onOpenChange={() => setDeleteGrantTarget(null)} title="Remove Grant" description={`Remove grant "${deleteGrantTarget?.name}"? All associated activations will be orphaned.`} onConfirm={handleDeleteGrant} />
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
