import { useState, useMemo } from 'react';
import { useDevMode } from '@/contexts/DevModeContext';
import { Link } from 'react-router-dom';
import { useStoreData } from '@/hooks/use-store-sync';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import * as store from '@/lib/store';
import type { Activation } from '@/lib/types';
import PageHeader from '@/components/PageHeader';

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
import { Plus, ShieldCheck, ShieldBan, Eye, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ActivationsPage() {
  const { licenses, activations, products, grants } = useStoreData();
  const { devMode } = useDevMode();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [filterLicense, setFilterLicense] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ grantId: '', deviceName: '', deviceFingerprint: '', ipAddress: '', systemId: '', installationType: 'standalone' as const, productFamily: '', productVersion: '', activationType: 'online' as const, interval: 30 });

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
    setForm({ grantId: grants[0]?.id || '', deviceName: '', deviceFingerprint: '', ipAddress: '', systemId: '', installationType: 'standalone', productFamily: '', productVersion: '', activationType: 'online', interval: 30 });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.grantId || !form.deviceName.trim()) { toast.error('Grant and device name are required'); return; }
    const grant = grants.find(g => g.id === form.grantId);
    const ts = new Date().toISOString();
    const product = grant ? products.find(p => licenses.find(l => l.id === grant.licenseId)?.productId === p.id) : null;
    store.createActivation({
      ...form,
      licenseId: grant?.licenseId || '',
      systemId: form.systemId || `SYS-${Date.now()}`,
      productFamily: form.productFamily || product?.name || '',
      activatedAt: ts,
      lastActivationCall: ts,
      lastProductActivationState: 'activated',
      lastSeenAt: ts,
      isActive: true,
    });
    toast.success('Activation created');
    setDialogOpen(false);
  };

  const toggleActive = (a: Activation) => {
    store.updateActivation(a.id, { isActive: !a.isActive });
    toast.success(a.isActive ? 'Denied' : 'Allowed');
  };

  

  const grantLabel = (grantId: string) => {
    const g = grants.find(gr => gr.id === grantId);
    return g ? `${g.name} (${g.grantType === 'main_license' ? 'Main' : 'Sub'})` : 'Unknown';
  };

  const licenseLabel = (id: string) => {
    const l = licenses.find(li => li.id === id);
    if (!l) return 'Unknown';
    const p = products.find(pr => pr.id === l.productId);
    return `${l.customerName} — ${p?.name || ''}`;
  };

  return (
    <>
      <PageHeader title="Activations" description="Track device activations across all licenses and grants" actions={
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
                <TableHead>System ID</TableHead>
                <TableHead>Grant</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Install Type</TableHead>
                <TableHead>Product Family</TableHead>
                <SortableHeader label="Version" active={sort?.key === 'productVersion'} direction={sort?.key === 'productVersion' ? sort.direction : undefined} onClick={() => toggleSort('productVersion')} />
                <SortableHeader label="Last Call" active={sort?.key === 'lastActivationCall'} direction={sort?.key === 'lastActivationCall' ? sort.direction : undefined} onClick={() => toggleSort('lastActivationCall')} />
                <TableHead>Last State</TableHead>
                <SortableHeader label="IP Address" active={sort?.key === 'ipAddress'} direction={sort?.key === 'ipAddress' ? sort.direction : undefined} onClick={() => toggleSort('ipAddress')} />
                <TableHead>Interval</TableHead>
                <TableHead>Act. Type</TableHead>
                <SortableHeader label="Status" active={sort?.key === 'isActive'} direction={sort?.key === 'isActive' ? sort.direction : undefined} onClick={() => toggleSort('isActive')} />
                <TableHead className="w-36" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map(a => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{a.deviceName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{a.deviceFingerprint}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{a.systemId}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-40 truncate">{grantLabel(a.grantId)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-40 truncate">{licenseLabel(a.licenseId)}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{a.installationType}</Badge></TableCell>
                  <TableCell className="text-xs">{a.productFamily}</TableCell>
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
                  <TableCell className="text-xs">{a.interval}m</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{a.activationType}</Badge></TableCell>
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
                      {devMode && <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(a.systemId); toast.success('System ID copied'); }} title="Copy System ID">
                        <Copy className="h-4 w-4" />
                      </Button>}
                      
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow><TableCell colSpan={14} className="text-center py-8 text-muted-foreground">No activations found</TableCell></TableRow>
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
            <div><Label>Grant</Label>
              <Select value={form.grantId} onValueChange={v => setForm(f => ({ ...f, grantId: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{grants.map(g => {
                  const l = licenses.find(li => li.id === g.licenseId);
                  return <SelectItem key={g.id} value={g.id}>{g.name} — {l?.customerName || 'Unknown'}</SelectItem>;
                })}</SelectContent>
              </Select>
            </div>
            <div><Label>Device Name</Label><Input value={form.deviceName} onChange={e => setForm(f => ({ ...f, deviceName: e.target.value }))} /></div>
            <div><Label>System ID</Label><Input value={form.systemId} onChange={e => setForm(f => ({ ...f, systemId: e.target.value }))} placeholder="Auto-generated if empty" className="font-mono" /></div>
            <div><Label>Device Fingerprint</Label><Input value={form.deviceFingerprint} onChange={e => setForm(f => ({ ...f, deviceFingerprint: e.target.value }))} className="font-mono" /></div>
            <div><Label>IP Address</Label><Input value={form.ipAddress} onChange={e => setForm(f => ({ ...f, ipAddress: e.target.value }))} className="font-mono" /></div>
            <div><Label>Product Version</Label><Input value={form.productVersion} onChange={e => setForm(f => ({ ...f, productVersion: e.target.value }))} className="font-mono" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Installation Type</Label>
                <Select value={form.installationType} onValueChange={v => setForm(f => ({ ...f, installationType: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standalone">Standalone</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                    <SelectItem value="embedded">Embedded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Activation Type</Label>
                <Select value={form.activationType} onValueChange={v => setForm(f => ({ ...f, activationType: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Create Activation</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      
    </>
  );
}
