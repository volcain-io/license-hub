import { TableHead } from '@/components/ui/table';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { SortDirection } from '@/hooks/use-pagination';
import { cn } from '@/lib/utils';

interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction?: SortDirection;
  onClick: () => void;
  className?: string;
}

export default function SortableHeader({ label, active, direction, onClick, className }: SortableHeaderProps) {
  return (
    <TableHead className={cn('cursor-pointer select-none hover:text-foreground transition-colors', className)} onClick={onClick}>
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-30" />
        )}
      </div>
    </TableHead>
  );
}
