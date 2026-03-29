import { useState } from 'react';
import { useStoreData } from '@/hooks/use-store-sync';
import * as store from '@/lib/store';
import type { Activation } from '@/lib/types';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Power, PowerOff } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ActivationsPage() {
  const { licenses, activations, products } = useStoreData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Activation | null>(null);
  const [filterLicense, setFilterLicense] = useState<string>('all');
  const [form, setForm] = useState({ licenseId: '', deviceName: '', deviceFingerprint: '', ipAddress: '' });

  const filtered = filterLicense === 'all' ? activations : activations.filter(a => a.licenseId === filterLicense);

  const openCreate = () => {
    setForm({ licenseId: licenses[0]?.id || '', deviceName: '', deviceFingerprint: '', ipAddress: '' });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.licenseId || !form.deviceName.trim()) { toast.error('License and device name are required'); return; }
    const now = new Date().toISOString();
    store.createActivation({ ...form, activatedAt: now, lastSeenAt: now, isActive: true });
    toast.success('Activation created');
    setDialogOpen(false);
  };

  const toggleActive = (a: Activation) => {
    store.updateActivation(a.id, { isActive: !a.isActive });
    toast.success(a.isActive ? 'Deactivated' : 'Reactivated');
  };

  const handleDelete = () => { if (deleteTarget) { store.deleteActivation(deleteTarget.id); toast.success('Activation removed'); } setDeleteTarget(null); };

  const licenseLabel = (id: string) => {
    const l = licenses.find(li => li.id === id);
    if (!l) return 'Unknown';
    const p = products.find(pr => pr.id === l.productId);
    return `${l.licenseKey.slice(0, 16)}… — ${p?.name || ''}`;
  };

  return (
    <>
      <PageHeader title="Activations" description="Track device activations across all licenses" actions={
        <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Activation</Button>
      } />

      <div className="flex gap-3 mb-4">
        <Select value={filterLicense} onValueChange={setFilterLicense}>
          <SelectTrigger className="w-80"><SelectValue placeholder="All Licenses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Licenses</SelectItem>
            {licenses.map(l => <SelectItem key={l.id} value={l.id}>{l.licenseKey} — {l.customerName}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>License</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Activated</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{a.deviceName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{a.deviceFingerprint}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-48 truncate">{licenseLabel(a.licenseId)}</TableCell>
                  <TableCell className="font-mono text-xs">{a.ipAddress}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(a.activatedAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(a.lastSeenAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', a.isActive ? 'bg-success/15 text-success border-success/30' : 'bg-muted text-muted-foreground')}>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive(a)} title={a.isActive ? 'Deactivate' : 'Reactivate'}>
                        {a.isActive ? <PowerOff className="h-4 w-4 text-warning" /> : <Power className="h-4 w-4 text-success" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(a)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No activations found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Activation</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>License</Label>
              <Select value={form.licenseId} onValueChange={v => setForm(f => ({ ...f, licenseId: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{licenses.map(l => <SelectItem key={l.id} value={l.id}>{l.licenseKey} — {l.customerName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Device Name</Label><Input value={form.deviceName} onChange={e => setForm(f => ({ ...f, deviceName: e.target.value }))} /></div>
            <div><Label>Device Fingerprint</Label><Input value={form.deviceFingerprint} onChange={e => setForm(f => ({ ...f, deviceFingerprint: e.target.value }))} className="font-mono" /></div>
            <div><Label>IP Address</Label><Input value={form.ipAddress} onChange={e => setForm(f => ({ ...f, ipAddress: e.target.value }))} className="font-mono" /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Create Activation</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Remove Activation" description={`Remove activation for "${deleteTarget?.deviceName}"?`} onConfirm={handleDelete} />
    </>
  );
}
