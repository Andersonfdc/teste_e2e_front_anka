"use client";

import * as React from "react";
import { format, Locale } from "date-fns";
import { CalendarMonthOutlined as CalendarIcon } from "@mui/icons-material";
import { ptBR } from "date-fns/locale";
import { DateTime } from "luxon";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  CustomPopover,
  CustomPopoverContent,
  CustomPopoverTrigger,
} from "@/components/ui/custom/popover";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WallpaperOutlined } from '@mui/icons-material';
import Image from 'next/image';

export interface CustomDatePickerProps {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showInput?: boolean; // Whether to show as input field or button
  inputClassName?: string;
  buttonClassName?: string;
  formatString?: string; // Custom format string for display
  locale?: Locale; // Date-fns locale
  showMonthYearDropdowns?: boolean; // Whether to show month and year dropdown selectors
  yearRange?: { backward?: number; forward?: number }; // Number of years backward/forward from current year
  fixedHeight?: boolean; // Whether to use fixed height for consistent positioning
  // Preview props
  previewImage?: string;
  previewAlt?: string;
  previewWidth?: number;
  previewHeight?: number;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onValueChange,
  placeholder = "Selecione uma data",
  className,
  disabled = false,
  minDate,
  maxDate,
  showInput = false,
  inputClassName,
  buttonClassName,
  formatString = "PPP",
  locale = ptBR,
  showMonthYearDropdowns = false,
  yearRange = { backward: 100, forward: 20 }, // Default: 100 years back, 20 years forward
  fixedHeight = true,
  previewImage,
  previewAlt,
  previewWidth = 320,
  previewHeight = 192,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Calculate effective date range based on yearRange if minDate/maxDate not provided, using luxon
  const currentYear = DateTime.now().year;
  const effectiveMinDate = minDate 
    ? DateTime.fromJSDate(minDate).toJSDate() 
    : DateTime.local(currentYear - (yearRange.backward || 4), 1, 1).toJSDate();
  const effectiveMaxDate = maxDate 
    ? DateTime.fromJSDate(maxDate).toJSDate() 
    : DateTime.local(currentYear + (yearRange.forward || 20), 12, 31).toJSDate();

  // Set default month to current date or selected value
  const defaultMonth = value || DateTime.now().toJSDate();

  const handleSelect = (date: Date | undefined) => {
    if (disabled) return;
    onValueChange?.(date);
    setIsOpen(false);
  };

  const formatDisplayDate = (date: Date) => {
    try {
      return format(date, formatString, { locale });
    } catch {
      // Handle error silently or log if needed
      console.warn('Failed to parse date');
      // Return a fallback format if the custom format fails
      return format(date, 'dd/MM/yyyy', { locale });
    }
  };

  if (showInput) {
    return (
      <CustomPopover open={!disabled && isOpen} onOpenChange={(open) => !disabled && setIsOpen(open)}>
        <CustomPopoverTrigger asChild>
          <div className={cn('relative h-9', className)}>
            <Input
              value={value ? formatDisplayDate(value) : ''}
              placeholder={placeholder}
              readOnly
              disabled={disabled}
              className={cn(
                'cursor-pointer h-9',
                previewImage ? 'pr-20' : 'pr-12',
                inputClassName
              )}
              onClick={() => !disabled && setIsOpen(true)}
            />
            <div className={`absolute top-0 h-full flex items-center pointer-events-none ${previewImage ? 'right-16' : 'right-3'}`}>
              <CalendarIcon className="!h-4 !w-4 text-muted-foreground" />
            </div>
            {previewImage && (
              <div className="absolute right-3 top-0 h-full flex items-center gap-2">
                <div className="h-8 w-px bg-gray-300" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer">
                      <WallpaperOutlined className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="p-2">
                      <Image 
                        src={previewImage} 
                        alt={previewAlt || "Preview"} 
                        width={previewWidth}
                        height={previewHeight}
                        className="rounded"
                        style={{
                          maxWidth: `${previewWidth}px`,
                          maxHeight: `${previewHeight}px`,
                          width: 'auto',
                          height: 'auto'
                        }}
                        unoptimized
                      />
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </CustomPopoverTrigger>
        <CustomPopoverContent 
          className={cn(
            "w-auto p-0 pointer-events-auto", 
            fixedHeight && "h-[340px] overflow-hidden"
          )} 
          align="start"
        >
          <div className={fixedHeight ? "h-full flex flex-col" : ""}>
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleSelect}
              locale={locale}
              startMonth={effectiveMinDate}
              endMonth={effectiveMaxDate}
              defaultMonth={defaultMonth}
              disabled={(date) => {
                if (disabled) return true;
                // Disable dates outside the min/max range
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              captionLayout={showMonthYearDropdowns ? 'dropdown' : 'label'}
              className={cn(fixedHeight ? "flex-1" : "", "pointer-events-auto")}
            />
          </div>
        </CustomPopoverContent>
      </CustomPopover>
    );
  }

  return (
    <CustomPopover open={!disabled && isOpen} onOpenChange={(open) => !disabled && setIsOpen(open)}>
      <CustomPopoverTrigger asChild>
        <div className={cn('relative', className)}>
          <Button
            variant="outline"
            data-empty={!value}
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal h-9',
              !value && 'text-muted-foreground',
              previewImage ? 'pr-20' : 'pr-3',
              buttonClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? formatDisplayDate(value) : <span>{placeholder}</span>}
          </Button>
          {previewImage && (
            <div className="absolute right-3 top-0 h-full flex items-center gap-2">
              <div className="h-8 w-px bg-gray-300" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-pointer">
                    <WallpaperOutlined className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    <Image 
                      src={previewImage} 
                      alt={previewAlt || "Preview"} 
                      width={previewWidth}
                      height={previewHeight}
                      className="rounded"
                      style={{
                        maxWidth: `${previewWidth}px`,
                        maxHeight: `${previewHeight}px`,
                        width: 'auto',
                        height: 'auto'
                      }}
                      unoptimized
                    />
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </CustomPopoverTrigger>
      <CustomPopoverContent 
        className={cn(
          "w-auto p-0 pointer-events-auto", 
          fixedHeight && "h-[340px] overflow-hidden"
        )} 
        align="start"
      >
        <div className={fixedHeight ? "h-full flex flex-col" : ""}>
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            locale={locale}
            startMonth={effectiveMinDate}
            endMonth={effectiveMaxDate}
            defaultMonth={defaultMonth}
            disabled={(date) => {
              if (disabled) return true;
              // Disable dates outside the min/max range
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            captionLayout={showMonthYearDropdowns ? 'dropdown' : 'label'}
            className={cn(fixedHeight ? "flex-1" : "", "pointer-events-auto")}
          />
        </div>
      </CustomPopoverContent>
    </CustomPopover>
  );
};
