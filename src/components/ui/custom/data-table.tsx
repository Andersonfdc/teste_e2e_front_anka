"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownward, ArrowUpward, UnfoldMore } from "@mui/icons-material";
import { compareValues } from "@/utils/comparison";

export type DataTableSortDirection = "asc" | "desc";

export interface DataTableSort {
  columnId: string;
  direction: DataTableSortDirection;
}

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessor?: (row: T) => React.ReactNode;
  sortAccessor?: (row: T) => string | number | boolean | Date | null;
  sortable?: boolean;
  className?: string;
  width?: string;
  align?: "left" | "center" | "right";
  cell?: (row: T) => React.ReactNode;
}

export interface DataTablePaginationConfig {
  pageIndex: number;
  pageSize: number;
  onTotalChange?: (total: number) => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  getRowId: (row: T) => string;
  className?: string;

  // Sorting (controlled or uncontrolled)
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;

  // Filtering via custom predicate and external UI state
  filterState?: unknown;
  defaultFilterState?: unknown;
  onFilterStateChange?: (state: unknown) => void;
  filterFn?: (row: T, filterState: unknown) => boolean;
  filters?: React.ReactNode;

  // Pagination (controlled)
  pagination?: DataTablePaginationConfig;

  // Skeletons and empty fallback
  isLoading?: boolean;
  skeletonRowCount?: number;
  rowSkeletonPredicate?: (row: T) => boolean;
  emptyFallback?: React.ReactNode;
}

function HeaderSortIcon({ direction }: { direction: DataTableSortDirection | undefined }) {
  if (direction === "asc") return <ArrowUpward className="w-3.5 h-3.5" />;
  if (direction === "desc") return <ArrowDownward className="w-3.5 h-3.5" />;
  return <UnfoldMore className="w-3.5 h-3.5" />;
}

function SkeletonCell() {
  return <div className="h-4 bg-gray-200 rounded animate-pulse" />;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  className,
  sort: controlledSort,
  defaultSort = null,
  onSortChange,
  filterState: controlledFilterState,
  defaultFilterState = undefined,
  onFilterStateChange,
  filterFn,
  filters,
  pagination,
  isLoading = false,
  skeletonRowCount = 5,
  rowSkeletonPredicate,
  emptyFallback = (
    <div className="h-24 text-center text-slate-800 text-sm px-5 py-4">Nenhum resultado.</div>
  ),
}: DataTableProps<T>) {
  // Sorting state
  const [uncontrolledSort, setUncontrolledSort] = React.useState<DataTableSort | null>(defaultSort);
  const sort = controlledSort !== undefined ? controlledSort : uncontrolledSort;
  const setSort = React.useCallback((next: DataTableSort | null) => {
    if (onSortChange) onSortChange(next);
    if (controlledSort === undefined) setUncontrolledSort(next);
  }, [onSortChange, controlledSort]);

  // Filter state
  const [uncontrolledFilter, setUncontrolledFilter] = React.useState<unknown>(defaultFilterState);
  const filterState = controlledFilterState !== undefined ? controlledFilterState : uncontrolledFilter;
  const setFilterState = React.useCallback((next: unknown) => {
    onFilterStateChange?.(next);
    if (controlledFilterState === undefined) setUncontrolledFilter(next);
  }, [onFilterStateChange, controlledFilterState]);

  const processRowForSort = React.useCallback((row: T, col: DataTableColumn<T>) => {
    const value = col.sortAccessor ? col.sortAccessor(row) : (col.accessor ? col.accessor(row) : undefined);
    return value;
  }, []);

  const filteredSortedData = React.useMemo(() => {
    const filtered = typeof filterFn === "function" ? data.filter((r) => filterFn(r, filterState)) : data;
    if (!sort) return filtered;
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col) return filtered;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = processRowForSort(a, col);
      const vb = processRowForSort(b, col);
      return compareValues(va, vb) * dir;
    });
  }, [data, filterFn, filterState, sort, columns, processRowForSort]);

  // Notify total after filter/sort
  React.useEffect(() => {
    const total = filteredSortedData.length;
    pagination?.onTotalChange?.(total);
  }, [filteredSortedData, pagination]);

  const pageRows = React.useMemo(() => {
    if (!pagination) return filteredSortedData;
    const start = Math.max(0, pagination.pageIndex * pagination.pageSize);
    const end = Math.min(start + pagination.pageSize, filteredSortedData.length);
    return filteredSortedData.slice(start, end);
  }, [filteredSortedData, pagination]);

  const handleHeaderClick = React.useCallback((col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    const next: DataTableSort | null = !sort || sort.columnId !== col.id
      ? { columnId: col.id, direction: "asc" }
      : (sort.direction === "asc"
        ? { columnId: col.id, direction: "desc" }
        : null);
    setSort(next);
  }, [sort, setSort]);

  const currentSortDirFor = React.useCallback((colId: string): DataTableSortDirection | undefined => {
    if (!sort || sort.columnId !== colId) return undefined;
    return sort.direction;
  }, [sort]);

  const showSkeletonOnly = isLoading && data.length === 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Optional external filters UI */}
      {filters ? (
        <div className="mb-3">{filters}</div>
      ) : null}

      <div className="rounded-[10px] border border-neutral-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white border-b border-sky-900 hover:bg-white select-none">
              {columns.map((col) => (
                <TableHead
                  key={col.id}
                  className={cn(
                    "text-slate-800 text-sm font-semibold px-5 py-5 h-auto",
                    col.className,
                    col.sortable ? "cursor-pointer" : undefined,
                    col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => handleHeaderClick(col)}
                >
                  <div className={cn("inline-flex items-center gap-2", col.align === "center" ? "justify-center" : col.align === "right" ? "justify-end" : "justify-start")}> 
                    <span>{col.header}</span>
                    {col.sortable ? <HeaderSortIcon direction={currentSortDirFor(col.id)} /> : null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {showSkeletonOnly ? (
              Array.from({ length: skeletonRowCount }).map((_, idx) => (
                <TableRow key={`skeleton-only-${idx}`} className="bg-white border-b border-stone-300">
                  {columns.map((col, cIdx) => (
                    <TableCell key={cIdx} className="text-slate-800 text-sm px-5 py-4 h-auto">
                      <SkeletonCell />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : pageRows.length > 0 ? (
              pageRows.map((row) => {
                const isRowSkeleton = rowSkeletonPredicate?.(row) === true;
                const rowId = getRowId(row);
                return (
                  <TableRow key={rowId} className="bg-white border-b border-stone-300 hover:bg-neutral-50">
                    {columns.map((col, cIdx) => (
                      <TableCell key={`${rowId}-${col.id}-${cIdx}`} className={cn("text-slate-800 text-sm px-5 py-4 h-auto", col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left")}> 
                        {isLoading && isRowSkeleton ? (
                          <SkeletonCell />
                        ) : col.cell ? (
                          col.cell(row)
                        ) : (
                          col.accessor ? col.accessor(row) : null
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="bg-white border-b border-stone-300">
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-800 text-sm px-5 py-4">
                  {emptyFallback}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


