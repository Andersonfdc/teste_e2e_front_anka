"use client";

import { forwardRef, useCallback, useEffect, useState } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { KeyboardArrowUpOutlined, KeyboardArrowDownOutlined } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WallpaperOutlined } from '@mui/icons-material';
import Image from 'next/image';

export interface CustomNumberInputProps
  extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
  stepper?: number;
  thousandSeparator?: string;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number; // Controlled value
  suffix?: string;
  prefix?: string;
  onValueChange?: (value: number | undefined) => void;
  fixedDecimalScale?: boolean;
  decimalScale?: number;
  disabled?: boolean;
  // Preview props
  previewImage?: string;
  previewAlt?: string;
  previewWidth?: number;
  previewHeight?: number;
}

export const CustomNumberInput = forwardRef<HTMLInputElement, CustomNumberInputProps>(
  (
    {
      stepper,
      thousandSeparator,
      placeholder,
      defaultValue,
      min = -Infinity,
      max = Infinity,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 0,
      suffix,
      prefix,
      value: controlledValue,
      disabled = false,
      previewImage,
      previewAlt,
      previewWidth = 320,
      previewHeight = 192,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState<number | undefined>(
      controlledValue ?? defaultValue
    );

    const handleIncrement = useCallback((e?: React.MouseEvent) => {
      e?.stopPropagation();
      setValue((prev) =>
        prev === undefined ? stepper ?? 1 : Math.min(prev + (stepper ?? 1), max)
      );
    }, [stepper, max]);

    const handleDecrement = useCallback((e?: React.MouseEvent) => {
      e?.stopPropagation();
      setValue((prev) =>
        prev === undefined
          ? -(stepper ?? 1)
          : Math.max(prev - (stepper ?? 1), min)
      );
    }, [stepper, min]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const inputRef = ref as React.RefObject<HTMLInputElement>;
        if (
          inputRef?.current &&
          document.activeElement === inputRef.current
        ) {
          if (e.key === 'ArrowUp') {
            handleIncrement();
          } else if (e.key === 'ArrowDown') {
            handleDecrement();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleIncrement, handleDecrement, ref]);

    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    const handleChange = (values: {
      value: string;
      floatValue: number | undefined;
    }) => {
      const newValue =
        values.floatValue === undefined ? undefined : values.floatValue;
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    const handleBlur = () => {
      if (value !== undefined) {
        const inputRef = ref as React.RefObject<HTMLInputElement>;
        if (value < min) {
          setValue(min);
          if (inputRef?.current) {
            inputRef.current.value = String(min);
          }
        } else if (value > max) {
          setValue(max);
          if (inputRef?.current) {
            inputRef.current.value = String(max);
          }
        }
      }
    };

    return (
      <div className="relative">
        <NumericFormat
          value={value}
          onValueChange={handleChange}
          thousandSeparator={thousandSeparator}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          valueIsNumericString
          onBlur={handleBlur}
          max={max}
          min={min}
          suffix={suffix}
          prefix={prefix}
          customInput={Input}
          placeholder={placeholder}
          className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative h-9 ${
            previewImage ? 'pr-20' : 'pr-12'
          }`}
          getInputRef={ref}
          disabled={disabled}
          onKeyDown={(e) => {
            // Prevent arrow keys from bubbling up when used for increment/decrement
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.stopPropagation();
            }
            // Call the original onKeyDown if provided
            props.onKeyDown?.(e);
          }}
          {...props}
        />

        {!disabled && (
          <div className={`absolute top-0 h-9 flex flex-col ${previewImage ? 'right-12' : 'right-0'}`}>
            <Button
              type="button"
              aria-label="Increase value"
              className="px-1 h-4.5 rounded-none border-0 hover:bg-neutral-100 focus-visible:relative"
              variant="ghost"
              size="icon"
              onClick={(e) => handleIncrement(e)}
              disabled={value === max}
          >
              <KeyboardArrowUpOutlined className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              aria-label="Decrease value"
              className="px-1 h-4.5 rounded-none border-0 hover:bg-neutral-100 focus-visible:relative"
              variant="ghost"
              size="icon"
              onClick={(e) => handleDecrement(e)}
              disabled={value === min}
          >
              <KeyboardArrowDownOutlined className="h-3 w-3" />
            </Button>
          </div>
        )}

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

CustomNumberInput.displayName = "CustomNumberInput"; 