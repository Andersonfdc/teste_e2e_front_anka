"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterAltOffOutlined, ArrowDropDownOutlined } from "@mui/icons-material";
import { Button } from "../button";
import { Card, CardContent } from "../card";
import { cn } from "@/lib/utils";
import { CustomMonetaryInput } from "./inputs/monetary-input";
import { CustomDatePicker } from "./inputs/date-picker";
import { CustomNumberInput } from "./inputs/number-input";
import { Checkbox } from "../checkbox";

export interface FilterItem {
  id: string;
  label: string;
  value: string | string[] | number | boolean | { min?: number; max?: number } | { startDate?: Date | null; endDate?: Date | null };
  type: "text" | "number" | "select" | "multi-select" | "date" | "boolean" | "range" | "monetary-range" | "number-range" | "date-range";
  options?: Array<{ label: string; value: string | number }>;
  description?: string;
  icon?: React.ReactNode;
  rangeConfig?: {
    minLabel?: string;
    maxLabel?: string;
    minPlaceholder?: string;
    maxPlaceholder?: string;
    minValue?: number;
    maxValue?: number;
    startPlaceholder?: string;
    endPlaceholder?: string;
  };
}

export interface FilterCardProps {
  filters: FilterItem[];
  onFiltersChange?: (filters: FilterItem[]) => void;
  onApply?: (filters: FilterItem[]) => void;
  onClear?: () => void;
  triggerButton?: {
    variant?: "outline" | "default" | "ghost";
    size?: "sm" | "default" | "lg";
    className?: string;
  };
  className?: string;
  children?: React.ReactNode;
  renderFilter?: (filter: FilterItem, onChange: (value: FilterItem["value"]) => void) => React.ReactNode;
}

export function FilterIcon({ icon, className }: { icon: React.ReactNode; className?: string }) {
  return <div className={cn("flex-shrink-0", className)}>{icon}</div>;
}

export function FilterTitle({ title, className }: { title: string; className?: string }) {
  return <label className={cn("text-sm font-medium text-neutral-900", className)}>{title}:</label>;
}

export function FilterLabel({ icon, title, className }: { icon: React.ReactNode; title: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 flex-shrink-0 min-w-[140px]", className)}>
      <FilterIcon icon={icon} />
      <FilterTitle title={title} />
    </div>
  );
}

export function Filter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex-1 min-w-[250px] max-w-[300px]", className)}>{children}</div>;
}

export function FilterRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-6", className)}>{children}</div>;
}

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({ value, onChange, options, placeholder = "Selecione...", className }: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (selectedValue: string) => {
    const newValues = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange(newValues);
  };

  const displayValue = value.length > 0 ? (value.length === 1 ? options.find((opt) => opt.value === value[0])?.label : `${value.length} itens selecionados`) : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[200px] max-w-[300px]",
          className,
        )}
      >
        <span className={cn(value.length === 0 ? "text-neutral-400" : "text-neutral-900", "truncate text-left flex-1")}>{displayValue}</span>
        <svg className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-neutral-200 bg-white shadow-lg min-w-[200px] max-w-[300px]">
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn("flex items-center gap-2 px-2 py-2 text-sm cursor-pointer rounded-sm hover:bg-neutral-100", value.includes(option.value) && "bg-blue-50")}
              >
                <Checkbox checked={value.includes(option.value)} className="pointer-events-none" />
                <span className="text-neutral-900 truncate">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterCard({
  filters,
  onFiltersChange,
  onApply,
  onClear,
  triggerButton = { variant: "outline", size: "default" },
  className,
  children,
  renderFilter,
}: FilterCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState<FilterItem[]>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (id: string, value: FilterItem["value"]) => {
    const updated = localFilters.map((f) => (f.id === id ? { ...f, value } : f));
    setLocalFilters(updated);
    onFiltersChange?.(updated);
  };

  const handleApply = () => {
    onApply?.(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = localFilters.map((filter) => {
      if (Array.isArray(filter.value)) return { ...filter, value: [] };
      if (typeof filter.value === "object" && filter.value !== null && ("min" in filter.value || "max" in filter.value)) {
        return { ...filter, value: { min: undefined, max: undefined } };
      }
      if (typeof filter.value === "object" && filter.value !== null && ("startDate" in filter.value || "endDate" in filter.value)) {
        return { ...filter, value: { startDate: null, endDate: null } };
      }
      return { ...filter, value: "" };
    });
    setLocalFilters(cleared);
    onFiltersChange?.(cleared);
    onClear?.();
  };

  const activeFiltersCount = localFilters.filter((filter) => {
    if (Array.isArray(filter.value)) return filter.value.length > 0;
    if (typeof filter.value === "object" && filter.value !== null && ("min" in filter.value || "max" in filter.value)) {
      const v = filter.value as { min?: number; max?: number };
      return (v.min ?? null) !== null || (v.max ?? null) !== null;
    }
    if (typeof filter.value === "object" && filter.value !== null && ("startDate" in filter.value || "endDate" in filter.value)) {
      const v = filter.value as { startDate?: Date | null; endDate?: Date | null };
      return !!v.startDate || !!v.endDate;
    }
    return filter.value !== "" && filter.value !== null && filter.value !== undefined;
  }).length;

  return (
    <div className={cn("relative", className)}>
      <Button
        variant={triggerButton.variant}
        size={triggerButton.size}
        onClick={() => setIsOpen(!isOpen)}
        className={cn("flex items-center gap-2", triggerButton.className)}
      >
        Filtros
        <ArrowDropDownOutlined className="!h-4 !w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 w-[90vw] max-w-[500px] sm:left-0 sm:transform-none sm:w-auto sm:min-w-[500px] sm:max-w-[600px]"
          >
            <Card className="shadow-lg border-neutral-200 py-0">
              <CardContent className="space-y-4 p-4">
                <div className="space-y-3">
                  {localFilters.length > 0 && (
                    <div className="space-y-4">
                      {localFilters.map((filter) => (
                        <FilterRow key={filter.id}>
                          <FilterLabel icon={filter.icon} title={filter.label} />
                          <Filter>
                            <FilterItemComponent filter={filter} onChange={(value) => handleFilterChange(filter.id, value)} />
                          </Filter>
                        </FilterRow>
                      ))}
                    </div>
                  )}

                  {renderFilter && (
                    <div className="space-y-4">
                      {localFilters.map((filter) => (
                        <div key={filter.id}>{renderFilter(filter, (value) => handleFilterChange(filter.id, value))}</div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3">{children}</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <Button variant="ghost" size="sm" onClick={handleClear} className="text-neutral-600 hover:text-neutral-900">
                    <FilterAltOffOutlined className="!h-4 !w-4" />
                    Limpar Todos
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleApply} disabled={activeFiltersCount === 0}>
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilterItemComponentProps {
  filter: FilterItem;
  onChange: (value: FilterItem["value"]) => void;
}

function FilterItemComponent({ filter, onChange }: FilterItemComponentProps) {
  switch (filter.type) {
    case "text":
      return (
        <input
          type="text"
          value={(filter.value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Digite ${filter.label.toLowerCase()}...`}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={(filter.value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={`Digite ${filter.label.toLowerCase()}...`}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        />
      );
    case "select":
      return (
        <select
          value={(filter.value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        >
          <option value="">Selecione...</option>
          {filter.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case "multi-select":
      return (
        <MultiSelect
          value={Array.isArray(filter.value) ? (filter.value as string[]) : []}
          onChange={(value) => onChange(value)}
          options={filter.options?.map((opt) => ({ label: opt.label, value: String(opt.value) })) || []}
          placeholder={`Selecione ${filter.label.toLowerCase()}...`}
          className="w-full"
        />
      );
    case "range": {
      const v = typeof filter.value === "object" && filter.value !== null && "min" in filter.value ? (filter.value as { min?: number; max?: number }) : { min: undefined, max: undefined };
      return (
        <div className="flex flex-col gap-2 w-full">
          <CustomMonetaryInput
            placeholder={filter.rangeConfig?.minPlaceholder || "Valor mínimo"}
            value={v.min || undefined}
            onValueChange={(value: number | undefined) => onChange({ ...v, min: value || undefined })}
          />
          <CustomMonetaryInput
            placeholder={filter.rangeConfig?.maxPlaceholder || "Valor máximo"}
            value={v.max || undefined}
            onValueChange={(value: number | undefined) => onChange({ ...v, max: value || undefined })}
          />
        </div>
      );
    }
    case "monetary-range": {
      const v = typeof filter.value === "object" && filter.value !== null && "min" in filter.value ? (filter.value as { min?: number; max?: number }) : { min: undefined, max: undefined };
      return (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-neutral-700">{filter.rangeConfig?.minLabel || "De"}:</span>
            <CustomMonetaryInput
              placeholder={filter.rangeConfig?.minPlaceholder || "Valor mínimo"}
              value={v.min || undefined}
              onValueChange={(value: number | undefined) => onChange({ ...v, min: value || undefined })}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-neutral-700">{filter.rangeConfig?.maxLabel || "Até"}:</span>
            <CustomMonetaryInput
              placeholder={filter.rangeConfig?.maxPlaceholder || "Valor máximo"}
              value={v.max || undefined}
              onValueChange={(value: number | undefined) => onChange({ ...v, max: value || undefined })}
            />
          </div>
        </div>
      );
    }
    case "number-range": {
      const v = typeof filter.value === "object" && filter.value !== null && "min" in filter.value ? (filter.value as { min?: number; max?: number }) : { min: undefined, max: undefined };
      return (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-neutral-700">{filter.rangeConfig?.minLabel || "De"}:</span>
            <CustomNumberInput
              placeholder={filter.rangeConfig?.minPlaceholder || "Valor mínimo"}
              value={v.min || undefined}
              onValueChange={(value: number | undefined) => onChange({ ...v, min: value })}
              min={0}
              decimalScale={2}
              fixedDecimalScale={false}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-neutral-700">{filter.rangeConfig?.maxLabel || "Até"}:</span>
            <CustomNumberInput
              placeholder={filter.rangeConfig?.maxPlaceholder || "Valor máximo"}
              value={v.max || undefined}
              onValueChange={(value: number | undefined) => onChange({ ...v, max: value })}
              min={0}
              decimalScale={2}
              fixedDecimalScale={false}
            />
          </div>
        </div>
      );
    }
    case "boolean":
      return (
        <select
          value={String(filter.value)}
          onChange={(e) => onChange(e.target.value === "true")}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        >
          <option value="">Selecione...</option>
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>
      );
    case "date-range": {
      const v = typeof filter.value === "object" && filter.value !== null && "startDate" in filter.value ? (filter.value as { startDate?: Date | null; endDate?: Date | null }) : { startDate: null, endDate: null };
      return (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-neutral-700">{filter.rangeConfig?.minLabel || "De"}:</span>
            <CustomDatePicker
              value={v.startDate || undefined}
              onValueChange={(date) => onChange({ ...v, startDate: date || null })}
              placeholder={filter.rangeConfig?.startPlaceholder || "Selecione"}
              showInput={true}
              formatString="dd/MM/yyyy"
              className="w-full"
              maxDate={v.endDate || undefined}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-neutral-700">{filter.rangeConfig?.maxLabel || "Até"}:</span>
            <CustomDatePicker
              value={v.endDate || undefined}
              onValueChange={(date) => onChange({ ...v, endDate: date || null })}
              placeholder={filter.rangeConfig?.endPlaceholder || "Selecione"}
              showInput={true}
              formatString="dd/MM/yyyy"
              className="w-full"
              minDate={v.startDate || undefined}
            />
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

export function useFilters(initialFilters: FilterItem[] = []) {
  const [filters, setFilters] = React.useState<FilterItem[]>(initialFilters);

  const addFilter = React.useCallback((filter: FilterItem) => {
    setFilters((prev) => [...prev, filter]);
  }, []);

  const removeFilter = React.useCallback((id: string) => {
    setFilters((prev) => prev.filter((filter) => filter.id !== id));
  }, []);

  const updateFilter = React.useCallback((id: string, value: string | string[] | number | boolean) => {
    setFilters((prev) => prev.map((filter) => (filter.id === id ? { ...filter, value } : filter)));
  }, []);

  const clearFilters = React.useCallback(() => {
    setFilters((prev) => prev.map((filter) => ({ ...filter, value: Array.isArray(filter.value) ? [] : "" })));
  }, []);

  const getActiveFilters = React.useCallback(() => {
    return filters.filter((filter) => {
      if (Array.isArray(filter.value)) return filter.value.length > 0;
      return filter.value !== "" && filter.value !== null && filter.value !== undefined;
    });
  }, [filters]);

  return { filters, setFilters, addFilter, removeFilter, updateFilter, clearFilters, getActiveFilters };
}


