import { useState } from 'react';
import { useStoreData } from '@/hooks/use-store-sync';
import * as store from '@/lib/store';
import type { Product } from '@/lib/types';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { products, licenses } = useStoreData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  const openCreate = () => { setEditing(null); setForm({ name: '', slug: '', description: '' }); setDialogOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, slug: p.slug, description: p.description }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (editing) {
      store.updateProduct(editing.id, form);
      toast.success('Product updated');
    } else {
      store.createProduct(form);
      toast.success('Product created');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) { store.deleteProduct(deleteTarget.id); toast.success('Product deleted'); }
    setDeleteTarget(null);
  };

  return (
    <>
      <PageHeader title="Products" description="Manage your software product catalog" actions={
        <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
      } />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Licenses</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.slug}</TableCell>
                  <TableCell>{licenses.filter(l => l.productId === p.id).length}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(new Date(p.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(p)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No products yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Product' : 'New Product'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="e.g. my-product" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editing ? 'Save Changes' : 'Create Product'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete Product" description={`Delete "${deleteTarget?.name}"? This cannot be undone.`} onConfirm={handleDelete} />
    </>
  );
}
