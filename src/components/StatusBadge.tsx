import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LicenseStatus } from '@/lib/types';

const statusConfig: Record<LicenseStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-success/15 text-success border-success/30' },
  expired: { label: 'Expired', className: 'bg-muted text-muted-foreground border-border' },
  suspended: { label: 'Suspended', className: 'bg-warning/15 text-warning border-warning/30' },
  revoked: { label: 'Revoked', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

export default function StatusBadge({ status }: { status: LicenseStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('font-medium text-xs', config.className)}>
      {config.label}
    </Badge>
  );
}
