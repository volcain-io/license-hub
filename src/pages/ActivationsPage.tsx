import { useState, useMemo } from 'react';
import { useStoreData } from '@/hooks/use-store-sync';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import * as store from '@/lib/store';
import type { Activation } from '@/lib/types';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import TablePagination from '@/components/TablePagination';
import SortableHeader from '@/components/SortableHeader';
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
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ licenseId: '', deviceName: '', deviceFingerprint: '', ipAddress: '' });

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let result = filterLicense === 'all' ? activations : activations.filter(a => a.licenseId === filterLicense);
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase();
      result = result.filter(a => a.deviceName.toLowerCase().includes(s) || a.deviceFingerprint.toLowerCase().includes(s) || a.ipAddress.includes(s));
    }
    return result;
  }, [activations, filterLicense, debouncedSearch]);

  const { paginatedData, page, pageSize, totalPages, totalItems, sort, setPage, setPageSize, toggleSort } = usePagination<Activation>({
    data: filtered,
    defaultPageSize: 25,
    defaultSort: { key: 'activatedAt', direction: 'desc' },
  });

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

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="Search devices, IPs…" className="w-64" value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={filterLicense} onValueChange={v => { setFilterLicense(v); setPage(1); }}>
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
                <SortableHeader label="Device" active={sort?.key === 'deviceName'} direction={sort?.key === 'deviceName' ? sort.direction : undefined} onClick={() => toggleSort('deviceName')} />
                <TableHead>License</TableHead>
                <SortableHeader label="IP Address" active={sort?.key === 'ipAddress'} direction={sort?.key === 'ipAddress' ? sort.direction : undefined} onClick={() => toggleSort('ipAddress')} />
                <SortableHeader label="Activated" active={sort?.key === 'activatedAt'} direction={sort?.key === 'activatedAt' ? sort.direction : undefined} onClick={() => toggleSort('activatedAt')} />
                <SortableHeader label="Last Seen" active={sort?.key === 'lastSeenAt'} direction={sort?.key === 'lastSeenAt' ? sort.direction : undefined} onClick={() => toggleSort('lastSeenAt')} />
                <SortableHeader label="Status" active={sort?.key === 'isActive'} direction={sort?.key === 'isActive' ? sort.direction : undefined} onClick={() => toggleSort('isActive')} />
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map(a => (
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
              {paginatedData.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No activations found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination page={page} totalPages={totalPages} pageSize={pageSize} totalItems={activations.length} filteredCount={filtered.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
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
