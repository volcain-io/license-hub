import { useState } from 'react';
import { useStoreData } from '@/hooks/use-store-sync';
import * as store from '@/lib/store';
import type { License, LicenseStatus } from '@/lib/types';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const genKey = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const defaultForm = { licenseKey: '', productId: '', customerName: '', customerEmail: '', status: 'active' as LicenseStatus, maxActivations: 1, expiresAt: '', notes: '' };

export default function LicensesPage() {
  const { products, licenses, activations } = useStoreData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<License | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<License | null>(null);
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(defaultForm);

  const filtered = licenses.filter(l => {
    if (filterProduct !== 'all' && l.productId !== filterProduct) return false;
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    if (search) {
      const s = search.toLowerCase();
      return l.licenseKey.toLowerCase().includes(s) || l.customerName.toLowerCase().includes(s) || l.customerEmail.toLowerCase().includes(s);
    }
    return true;
  });

  const openCreate = () => {
    setEditing(null);
    const prefix = products[0]?.slug.slice(0, 3).toUpperCase() || 'LIC';
    setForm({ ...defaultForm, licenseKey: genKey(prefix), productId: products[0]?.id || '' });
    setDialogOpen(true);
  };

  const openEdit = (l: License) => {
    setEditing(l);
    setForm({ licenseKey: l.licenseKey, productId: l.productId, customerName: l.customerName, customerEmail: l.customerEmail, status: l.status, maxActivations: l.maxActivations, expiresAt: l.expiresAt ? l.expiresAt.slice(0, 10) : '', notes: l.notes });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.customerName.trim() || !form.productId) { toast.error('Customer name and product are required'); return; }
    const data = { ...form, expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null };
    if (editing) {
      store.updateLicense(editing.id, data);
      toast.success('License updated');
    } else {
      store.createLicense(data);
      toast.success('License created');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => { if (deleteTarget) { store.deleteLicense(deleteTarget.id); toast.success('License deleted'); } setDeleteTarget(null); };
  const copyKey = (key: string) => { navigator.clipboard.writeText(key); toast.success('Key copied'); };
  const productName = (id: string) => products.find(p => p.id === id)?.name || 'Unknown';

  return (
    <>
      <PageHeader title="Licenses" description="Manage license keys and assignments" actions={
        <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" /> New License</Button>
      } />

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="Search keys, customers…" className="w-64" value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={filterProduct} onValueChange={setFilterProduct}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Products" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Key</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activations</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(l => {
                const usedActivations = activations.filter(a => a.licenseId === l.id && a.isActive).length;
                return (
                  <TableRow key={l.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">{l.licenseKey}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyKey(l.licenseKey)}><Copy className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{productName(l.productId)}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{l.customerName}</div>
                      <div className="text-xs text-muted-foreground">{l.customerEmail}</div>
                    </TableCell>
                    <TableCell><StatusBadge status={l.status} /></TableCell>
                    <TableCell className="text-sm">{usedActivations}/{l.maxActivations}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{l.expiresAt ? format(new Date(l.expiresAt), 'MMM d, yyyy') : '∞'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(l)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No licenses found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit License' : 'New License'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>License Key</Label><Input value={form.licenseKey} onChange={e => setForm(f => ({ ...f, licenseKey: e.target.value }))} className="font-mono" /></div>
            <div><Label>Product</Label>
              <Select value={form.productId} onValueChange={v => setForm(f => ({ ...f, productId: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Customer Name</Label><Input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} /></div>
              <div><Label>Customer Email</Label><Input type="email" value={form.customerEmail} onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as LicenseStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Max Activations</Label><Input type="number" min={1} value={form.maxActivations} onChange={e => setForm(f => ({ ...f, maxActivations: parseInt(e.target.value) || 1 }))} /></div>
              <div><Label>Expires</Label><Input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} /></div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editing ? 'Save Changes' : 'Create License'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete License" description={`Delete license "${deleteTarget?.licenseKey}"? This cannot be undone.`} onConfirm={handleDelete} />
    </>
  );
}
