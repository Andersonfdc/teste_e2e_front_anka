"use client";

import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Utility functions for percentage handling
const applyPercentageMask = (value: string, decimalPlaces: number = 2): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  if (!digits) return '';
  
  // Convert to number and apply decimal places
  const num = parseInt(digits, 10);
  const withDecimals = num / Math.pow(10, decimalPlaces);
  
  // Format with Brazilian locale (comma as decimal separator)
  return withDecimals.toLocaleString('pt-BR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

const removePercentageMask = (value: string): number => {
  if (!value) return 0;
  
  // Replace comma with dot for parsing and remove any non-digit/dot characters
  const cleanValue = value.replace(',', '.').replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleanValue);
  
  return isNaN(parsed) ? 0 : parsed;
};

const formatPercentage = (value: number, decimalPlaces: number = 2): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

const sanitizePercentageInput = (input: string): string => {
  // Only allow digits
  return input.replace(/\D/g, '');
};

export interface CustomPercentageInputProps {
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
}

export const CustomPercentageInput = forwardRef<HTMLInputElement, CustomPercentageInputProps>(
  (
    {
      placeholder = "0,00",
      defaultValue,
      min = 0,
      max = 100,
      onValueChange,
      decimalScale = 2,
      className,
      value: controlledValue,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);

    // Initialize display value
    useEffect(() => {
      if (controlledValue !== undefined && controlledValue !== 0) {
        const formatted = formatPercentage(controlledValue, decimalScale);
        setDisplayValue(formatted);
      } else if (defaultValue !== undefined && defaultValue !== 0) {
        const formatted = formatPercentage(defaultValue, decimalScale);
        setDisplayValue(formatted);
      } else {
        setDisplayValue('');
      }
    }, [controlledValue, defaultValue, decimalScale]);

    // Handle controlled value changes
    useEffect(() => {
      if (controlledValue !== undefined && controlledValue !== 0) {
        const formatted = formatPercentage(controlledValue, decimalScale);
        setDisplayValue(formatted);
      } else if (controlledValue === undefined || controlledValue === 0) {
        if (!isFocused) {
          setDisplayValue('');
        }
      }
    }, [controlledValue, decimalScale, isFocused]);

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
      const sanitized = sanitizePercentageInput(inputValue);
      
      if (!sanitized) {
        setDisplayValue('');
        if (onValueChange) {
          onValueChange(undefined);
        }
        return;
      }

      // Apply percentage mask (decimal-first approach)
      const masked = applyPercentageMask(sanitized, decimalScale);
      setDisplayValue(masked);
      
      // Convert to number for callback
      const numericValue = removePercentageMask(masked);
      
      // Validate min/max
      if (numericValue < min || numericValue > max) {
        return;
      }
      
      if (onValueChange) {
        onValueChange(numericValue);
      }
    }, [decimalScale, min, max, onValueChange]);

    // Handle focus - show clean number for editing
    const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      // If displayValue is empty, show 0,00 for editing
      if (!displayValue) {
        const defaultFormatted = '0' + ','.repeat(1) + '0'.repeat(decimalScale);
        setDisplayValue(defaultFormatted);
        return;
      }
      
      // Convert formatted value to clean string for editing
      const numericValue = removePercentageMask(displayValue);
      const cleanValue = numericValue.toString().replace('.', ',');
      setDisplayValue(cleanValue);
      
      if (onFocus) {
        onFocus(event);
      }
    }, [displayValue, decimalScale, onFocus]);

    // Handle blur - format the value properly
    const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      // If displayValue is empty or just zeros, clear it
      const numericCheck = removePercentageMask(displayValue);
      if (!displayValue || numericCheck === 0) {
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
      const numericValue = removePercentageMask(displayValue);
      
      // Validate and correct min/max
      let correctedValue = numericValue;
      if (numericValue < min) {
        correctedValue = min;
      } else if (numericValue > max) {
        correctedValue = max;
      }
      
      // Format the corrected value
      const formattedValue = formatPercentage(correctedValue, decimalScale);
      setDisplayValue(formattedValue);
      
      // Call onValueChange with corrected value if it changed
      if (onValueChange && correctedValue !== numericValue) {
        onValueChange(correctedValue);
      }
      
      if (onBlur) {
        onBlur(event);
      }
    }, [displayValue, decimalScale, min, max, onValueChange, onBlur]);

    return (
      <div className={cn("relative w-full", className)}>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pr-8 pl-3 w-full"
          {...props}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          %
        </div>
      </div>
    );
  }
);

CustomPercentageInput.displayName = "CustomPercentageInput";