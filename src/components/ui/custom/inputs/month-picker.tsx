"use client";

import * as React from "react";
import { format, Locale } from "date-fns";
import { CalendarMonthOutlined as CalendarIcon } from "@mui/icons-material";
import { ptBR } from "date-fns/locale";
import { DateTime } from 'luxon';

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../select";

export interface CustomMonthPickerProps {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  inputClassName?: string;
  popoverClassName?: string;
  formatString?: string; // default: MM/yyyy
  locale?: Locale;
  yearRange?: { backward?: number; forward?: number };
}

export const CustomMonthPicker: React.FC<CustomMonthPickerProps> = ({
  value,
  onValueChange,
  placeholder = "MM/AAAA",
  className,
  disabled = false,
  inputClassName,
  popoverClassName,
  formatString = "MM/yyyy",
  locale = ptBR,
  yearRange = { backward: 10, forward: 10 },
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Compute months and years list
  const months = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, m) => ({
        value: m.toString(),
        label: format(new Date(2000, m, 1), "LLL", { locale }),
      })),
    [locale]
  );

  const years = React.useMemo(() => {
    const currentYear = DateTime.now().year;
    const start = currentYear - (yearRange.backward ?? 10);
    const end = currentYear + (yearRange.forward ?? 10);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [yearRange]);

  const initialDate = value ?? new Date();
  const [inputValue, setInputValue] = React.useState<string>(value ? format(value, formatString, { locale }) : "");
  const [selectedMonth, setSelectedMonth] = React.useState(initialDate.getMonth());
  const [selectedYear, setSelectedYear] = React.useState(initialDate.getFullYear());

  React.useEffect(() => {
    if (value) {
      setSelectedMonth(value.getMonth());
      setSelectedYear(value.getFullYear());
      setInputValue(format(value, formatString, { locale }));
    } else {
      setInputValue("");
    }
  }, [value, formatString, locale]);

  const handleConfirm = () => {
    const date = new Date(selectedYear, selectedMonth, 1);
    onValueChange?.(date);
    setInputValue(format(date, formatString, { locale }));
    setIsOpen(false);
  };

  

  return (
    <Popover open={isOpen} onOpenChange={(o) => !disabled && setIsOpen(o)}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <Input
            value={inputValue}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("cursor-text", inputClassName)}
            onChange={(e) => {
              const val = e.target.value;
              setInputValue(val);
              const match = val.trim().match(/^(0?[1-9]|1[0-2])\/(\d{4})$/);
              if (match) {
                const month = parseInt(match[1]) - 1;
                const year = parseInt(match[2]);
                setSelectedMonth(month);
                setSelectedYear(year);
                onValueChange?.(new Date(year, month, 1));
              }
            }}
            onFocus={() => setIsOpen(false)}
            onClick={() => !disabled && setIsOpen(true)}
          />
          <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 !h-4 !w-4 text-muted-foreground pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[260px] p-4 space-y-4", popoverClassName)}
        align="start"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Month selector */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Mês</span>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(val) => setSelectedMonth(parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year selector */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Ano</span>
            <Select
              value={selectedYear.toString()}
              onValueChange={(val) => setSelectedYear(parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={handleConfirm} size="sm" className="!cursor-pointer">
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
