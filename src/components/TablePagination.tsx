import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TablePaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  filteredCount?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZES = [10, 25, 50, 100];

export default function TablePagination({ page, totalPages, pageSize, totalItems, filteredCount, onPageChange, onPageSizeChange }: TablePaginationProps) {
  const showingFrom = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, filteredCount ?? totalItems);
  const total = filteredCount ?? totalItems;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {total === 0 ? 'No results' : `${showingFrom.toLocaleString()}–${showingTo.toLocaleString()} of ${total.toLocaleString()}`}
        </span>
        {filteredCount != null && filteredCount !== totalItems && (
          <span className="text-xs">({totalItems.toLocaleString()} total)</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Rows</span>
          <Select value={String(pageSize)} onValueChange={v => onPageSizeChange(Number(v))}>
            <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onPageChange(1)}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-2 min-w-[80px] text-center">
            {page} / {totalPages}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
