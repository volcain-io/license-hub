import { useMemo, useState, useCallback } from 'react';

export type SortDirection = 'asc' | 'desc';
export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

interface UsePaginationOptions<T> {
  data: T[];
  defaultPageSize?: number;
  defaultSort?: SortConfig<T>;
}

export function usePagination<T>({ data, defaultPageSize = 25, defaultSort }: UsePaginationOptions<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sort, setSort] = useState<SortConfig<T> | null>(defaultSort ?? null);

  const sorted = useMemo(() => {
    if (!sort) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return sort.direction === 'asc' ? (aVal === bVal ? 0 : aVal ? -1 : 1) : (aVal === bVal ? 0 : aVal ? 1 : -1);
      }
      return String(aVal).localeCompare(String(bVal)) * (sort.direction === 'asc' ? 1 : -1);
    });
  }, [data, sort]);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage, pageSize]);

  const toggleSort = useCallback((key: keyof T) => {
    setSort(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }, [totalPages]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  return {
    paginatedData,
    page: safePage,
    pageSize,
    totalPages,
    totalItems,
    sort,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    toggleSort,
  };
}
