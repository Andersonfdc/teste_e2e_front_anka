"use client";

import * as React from "react";
import {ChevronLeftOutlined, ChevronRightOutlined, MoreVertOutlined} from "@mui/icons-material";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable, DataTableColumn } from "@/components/ui/custom/data-table";
import { User, UserRole, UserRoleNames } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface UserTableActions {
  onViewDetails?: (user: User) => void;
  onEditUser?: (user: User) => void;
}

export interface UserDataTableProps extends UserTableActions {
  data: User[];
  isLoading?: boolean;
  skeletonRows?: string[];
}

export function UserDataTable({ 
  data, 
  isLoading = false, 
  skeletonRows = [], 
  onViewDetails, 
  onEditUser 
}: UserDataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page") ?? "1");
  const limitFromUrl = Number(searchParams.get("limit") ?? "10");
  const pageIndex = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl - 1 : 0;
  const pageSize = Number.isFinite(limitFromUrl) && limitFromUrl > 0 ? limitFromUrl : 10;

  const setQueryParams = React.useCallback((updates: { page?: number; limit?: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.page !== undefined) params.set("page", String(updates.page));
    if (updates.limit !== undefined) params.set("limit", String(updates.limit));
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Total rows after filtering
  const [totalRows, setTotalRows] = React.useState<number>(data.length);
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const clampedPageIndex = Math.min(pageIndex, totalPages - 1);
  const start = clampedPageIndex * pageSize;
  const end = Math.min(start + pageSize, totalRows);

  const currentPage = clampedPageIndex + 1;
  const handlePrev = () => setQueryParams({ page: Math.max(1, currentPage - 1) });
  const handleNext = () => setQueryParams({ page: Math.min(totalPages, currentPage + 1) });
  const handlePageSizeChange = (value: string) => {
    const size = Number(value);
    setQueryParams({ limit: size, page: 1 });
  };

  type FilterState = {
    query: string;
    role: UserRole | "all";
    status: "all" | "active" | "inactive";
  };

  const [filters, setFilters] = React.useState<FilterState>({ query: "", role: "all", status: "all" });

  const onFilterChange = React.useCallback((partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setQueryParams({ page: 1 });
  }, [setQueryParams]);

  const columns = React.useMemo<DataTableColumn<User>[]>(() => [
    {
      id: "name",
      header: "Nome",
      accessor: (u) => (
        <div className="font-medium text-slate-800">{u.name}</div>
      ),
      sortAccessor: (u) => u.name.toLowerCase(),
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      accessor: (u) => <div className="text-slate-800">{u.email}</div>,
      sortAccessor: (u) => u.email.toLowerCase(),
      sortable: true,
    },
    {
      id: "role",
      header: "Função",
      accessor: (u) => <div className="text-slate-800">{UserRoleNames[u.role]}</div>,
      sortAccessor: (u) => UserRoleNames[u.role],
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (u) => (
        <Badge variant={u.isActive ? "default" : "destructive"}>
          {u.isActive ? "Ativo" : "Inativo"}
        </Badge>
      ),
      sortAccessor: (u) => (u.isActive ? 1 : 0),
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      align: "center",
      cell: (u) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer" title="Ações">
                <MoreVertOutlined className="w-4 h-4 text-neutral-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6}>
              <DropdownMenuItem onClick={() => onViewDetails?.(u)}>
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditUser?.(u)}>
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ], [onViewDetails, onEditUser]);

  const filterFn = React.useCallback((u: User, state: FilterState) => {
    const query = state.query.trim().toLowerCase();
    if (query) {
      const inName = u.name.toLowerCase().includes(query);
      const inEmail = u.email.toLowerCase().includes(query);
      if (!inName && !inEmail) return false;
    }

    if (state.role !== "all" && u.role !== state.role) return false;

    if (state.status !== "all") {
      const shouldBeActive = state.status === "active";
      if (u.isActive !== shouldBeActive) return false;
    }

    return true;
  }, []);

  const filtersBar = (
    <div className="w-full bg-white border-b border-stone-300 px-5 py-3 grid grid-cols-1 md:grid-cols-3 gap-3">
      <Input
        value={filters.query}
        onChange={(e) => onFilterChange({ query: e.target.value })}
        placeholder="Buscar por nome ou email"
      />
      <Select
        value={String(filters.role)}
        onValueChange={(val) => onFilterChange({ role: (val as UserRole | "all") })}
      >
        <SelectTrigger className="!h-9 !bg-white !rounded-[5px] text-neutral-400 !px-2">
          <SelectValue placeholder="Função" />
        </SelectTrigger>
        <SelectContent side="top">
          <SelectItem value="all">Todas as funções</SelectItem>
          {Object.values(UserRole).map((role) => (
            <SelectItem key={role} value={role}>{UserRoleNames[role]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.status}
        onValueChange={(val) => onFilterChange({ status: val as FilterState["status"] })}
      >
        <SelectTrigger className="!h-9 !bg-white !rounded-[5px] text-neutral-400 !px-2">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent side="top">
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="active">Ativos</SelectItem>
          <SelectItem value="inactive">Inativos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="w-full">
      <div className="rounded-[10px] border border-neutral-100 overflow-hidden">
        <DataTable<User>
          data={data}
          columns={columns}
          getRowId={(u) => u.id}
          isLoading={isLoading}
          rowSkeletonPredicate={(u) => skeletonRows.includes(u.id)}
          filters={filtersBar}
          filterState={filters}
          onFilterStateChange={(s) => setFilters(s as FilterState)}
          filterFn={(u, s) => filterFn(u, s as FilterState)}
          pagination={{ pageIndex: clampedPageIndex, pageSize, onTotalChange: setTotalRows }}
          emptyFallback={<span>Nenhum resultado.</span>}
        />
        {/** Footer with pagination summary + controls */}
        {totalRows > 0 && (
          <div className="w-full bg-white border-t border-stone-300 px-5 flex items-center justify-between p-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-800 font-normal">
                {totalRows === 0 ? 0 : start + 1} - {end}
              </span>
              <span className="text-neutral-400 font-normal">
                de {totalRows}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-800 text-xs font-normal">Itens por página</span>
              <Select
                value={`${pageSize}`}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="!h-6 !bg-white !rounded-[5px] text-neutral-400 !px-2 !outline-1 !outline-offset-[-1px] !outline-neutral-400 inline-flex justify-start items-center text-xs hover:bg-neutral-50">
                  <SelectValue className="justify-start text-neutral-400 text-xs font-normal" />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="w-px h-6 border-l border-neutral-400" />
              <button 
                className="w-8 h-6 px-1.5 py-1.5 bg-white rounded-[5px] border border-neutral-400 flex justify-center items-center disabled:opacity-50 hover:bg-neutral-50"
                onClick={handlePrev}
                disabled={clampedPageIndex <= 0}
              >
                <ChevronLeftOutlined className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <button
                className="w-8 h-6 px-1.5 py-1.5 bg-white rounded-[5px] border border-neutral-400 flex justify-center items-center disabled:opacity-50 hover:bg-neutral-50"
                onClick={handleNext}
                disabled={clampedPageIndex >= totalPages - 1}
              >
                <ChevronRightOutlined className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}