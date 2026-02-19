"use client";

import { forwardRef, useCallback, useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  applyCurrencyMask, 
  removeCurrencyMask, 
  formatCurrency,
  sanitizeCurrencyInput,
  CurrencyMaskOptions 
} from '@/utils/currencyMask';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WallpaperOutlined } from '@mui/icons-material';
import Image from 'next/image';

export interface CustomMonetaryInputProps {
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number; // Controlled value
  onValueChange?: (value: number | undefined) => void;
  decimalScale?: number;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  // Preview props
  previewImage?: string;
  previewAlt?: string;
  previewWidth?: number;
  previewHeight?: number;
}

export const CustomMonetaryInput = forwardRef<HTMLInputElement, CustomMonetaryInputProps>(
  (
    {
      placeholder = "0,00",
      defaultValue,
      min = 0,
      max = Infinity,
      onValueChange,
      decimalScale = 2,
      className,
      value: controlledValue,
      onBlur,
      onFocus,
      previewImage,
      previewAlt,
      previewWidth = 320,
      previewHeight = 192,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);

    // Currency mask options - memoized to prevent unnecessary re-renders
    const maskOptions: CurrencyMaskOptions = useMemo(() => ({
      decimalSeparator: ',',
      thousandSeparator: '.',
      decimalPlaces: decimalScale,
    }), [decimalScale]);

    // Initialize display value
    useEffect(() => {
      if (controlledValue !== undefined && controlledValue !== 0) {
        const formatted = formatCurrency(controlledValue, maskOptions);
        setDisplayValue(formatted);
      } else if (defaultValue !== undefined && defaultValue !== 0) {
        const formatted = formatCurrency(defaultValue, maskOptions);
        setDisplayValue(formatted);
      } else {
        setDisplayValue('');
      }
    }, [controlledValue, defaultValue, maskOptions]);

    // Handle controlled value changes
    useEffect(() => {
      if (controlledValue !== undefined && controlledValue !== 0) {
        const formatted = formatCurrency(controlledValue, maskOptions);
        setDisplayValue(formatted);
      } else if (controlledValue === undefined || controlledValue === 0) {
        if (!isFocused) {
          setDisplayValue('');
        }
      }
    }, [controlledValue, maskOptions, isFocused]);

    // Handle value changes while typing
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      
      if (!inputValue) {
        setDisplayValue('');
        if (onValueChange) {
          onValueChange(undefined);
        }
        return;
      }

      // Sanitize input to only allow digits
      const sanitized = sanitizeCurrencyInput(inputValue);
      
      if (!sanitized) {
        setDisplayValue('');
        if (onValueChange) {
          onValueChange(undefined);
        }
        return;
      }

      // Apply currency mask (decimal-first approach)
      const masked = applyCurrencyMask(sanitized, maskOptions);
      setDisplayValue(masked);
      
      // Convert to number for callback
      const numericValue = removeCurrencyMask(masked, maskOptions);
      
      // Validate min/max
      if (numericValue < min || numericValue > max) {
        return;
      }
      
      if (onValueChange) {
        onValueChange(numericValue);
      }
    }, [maskOptions, min, max, onValueChange]);

    // Handle focus - show clean number for editing
    const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      // If displayValue is empty, show 0,00 for editing
      if (!displayValue) {
        setDisplayValue('0,00');
        return;
      }
      
      // Convert formatted value to clean string for editing
      const numericValue = removeCurrencyMask(displayValue, maskOptions);
      const cleanValue = numericValue.toString().replace('.', ',');
      setDisplayValue(cleanValue);
      
      if (onFocus) {
        onFocus(event);
      }
    }, [displayValue, maskOptions, onFocus]);

    // Handle blur - format the value properly
    const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      // If displayValue is empty or just 0,00, clear it
      if (!displayValue || displayValue === '0,00') {
        setDisplayValue('');
        if (onValueChange) {
          onValueChange(undefined);
        }
        if (onBlur) {
          onBlur(event);
        }
        return;
      }
      
      // Parse current value
      const numericValue = removeCurrencyMask(displayValue, maskOptions);
      
      // Validate and correct min/max
      let correctedValue = numericValue;
      if (numericValue < min) {
        correctedValue = min;
      } else if (numericValue > max) {
        correctedValue = max;
      }
      
      // Format the corrected value
      const formattedValue = formatCurrency(correctedValue, maskOptions);
      setDisplayValue(formattedValue);
      
      // Call onValueChange with corrected value if it changed
      if (onValueChange && correctedValue !== numericValue) {
        onValueChange(correctedValue);
      }
      
      if (onBlur) {
        onBlur(event);
      }
    }, [displayValue, maskOptions, min, max, onValueChange, onBlur]);

    return (
      <div className={cn("relative w-full h-9", className)}>
        <div className="absolute left-3 top-0 h-full flex items-center text-gray-400 pointer-events-none">
          R$
        </div>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "pl-8 w-full h-9",
            previewImage ? "pr-12" : "pr-3"
          )}
          {...props}
        />
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
    );
  }
);

CustomMonetaryInput.displayName = "CustomMonetaryInput"; 