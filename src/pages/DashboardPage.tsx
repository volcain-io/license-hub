import { useStoreData } from '@/hooks/use-store-sync';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';
import { Package, Key, Monitor, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const { products, licenses, activations } = useStoreData();
  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const expiredLicenses = licenses.filter(l => l.status === 'expired' || l.status === 'suspended').length;
  const activeActivations = activations.filter(a => a.isActive).length;

  const stats = [
    { title: 'Products', value: products.length, icon: Package, color: 'text-primary' },
    { title: 'Active Licenses', value: activeLicenses, icon: Key, color: 'text-success' },
    { title: 'Needs Attention', value: expiredLicenses, icon: AlertTriangle, color: 'text-warning' },
    { title: 'Active Devices', value: activeActivations, icon: Monitor, color: 'text-primary' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="License management overview" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
