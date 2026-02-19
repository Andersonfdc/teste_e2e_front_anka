/**
 * Currency mask utility for Brazilian Real (R$)
 * Handles decimal-first input like modern money transfer apps
 */

export interface CurrencyMaskOptions {
  decimalSeparator?: string;
  thousandSeparator?: string;
  decimalPlaces?: number;
}

export const DEFAULT_CURRENCY_OPTIONS: Required<CurrencyMaskOptions> = {
  decimalSeparator: ',',
  thousandSeparator: '.',
  decimalPlaces: 2,
};

/**
 * Applies currency mask to a string value
 * Converts "1234" to "12,34" (decimal-first approach)
 */
export function applyCurrencyMask(
  value: string,
  options: CurrencyMaskOptions = {}
): string {
  const opts = { ...DEFAULT_CURRENCY_OPTIONS, ...options };
  
  // Remove all non-numeric characters
  const numericOnly = value.replace(/\D/g, '');
  
  if (!numericOnly) {
    return `0${opts.decimalSeparator}00`;
  }
  
  // Pad with zeros to ensure we have at least decimalPlaces + 1 digits
  const padded = numericOnly.padStart(opts.decimalPlaces + 1, '0');
  
  // Split into integer and decimal parts
  const integerPart = padded.slice(0, -opts.decimalPlaces);
  const decimalPart = padded.slice(-opts.decimalPlaces);
  
  // Add thousand separators to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, opts.thousandSeparator);
  
  // Combine with decimal part
  return `${formattedInteger}${opts.decimalSeparator}${decimalPart}`;
}

/**
 * Removes currency mask and returns numeric value
 * Converts "1.234,56" to 1234.56
 */
export function removeCurrencyMask(
  value: string,
  options: CurrencyMaskOptions = {}
): number {
  const opts = { ...DEFAULT_CURRENCY_OPTIONS, ...options };
  
  if (!value) return 0;
  
  // Remove thousand separators and replace decimal separator with dot
  const cleaned = value
    .replace(new RegExp(`\\${opts.thousandSeparator}`, 'g'), '')
    .replace(new RegExp(`\\${opts.decimalSeparator}`), '.');
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats a number to currency string
 * Converts 1234.56 to "1.234,56"
 */
export function formatCurrency(
  value: number,
  options: CurrencyMaskOptions = {}
): string {
  const opts = { ...DEFAULT_CURRENCY_OPTIONS, ...options };
  
  // Validar se o valor é um número válido
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return `0${opts.decimalSeparator}00`;
  }
  
  if (value === 0) {
    return `0${opts.decimalSeparator}00`;
  }
  
  // Convert to string with proper decimal places
  const fixed = value.toFixed(opts.decimalPlaces);
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = fixed.split('.');
  
  // Add thousand separators to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, opts.thousandSeparator);
  
  // Combine with decimal part
  return `${formattedInteger}${opts.decimalSeparator}${decimalPart}`;
}

/**
 * Sanitizes input to only allow valid currency characters
 */
export function sanitizeCurrencyInput(value: string): string {
  // Remove all characters except digits
  return value.replace(/\D/g, '');
}

/**
 * Validates if a string is a valid currency input
 */
export function isValidCurrencyInput(
  value: string,
  options: CurrencyMaskOptions = {}
): boolean {
  const opts = { ...DEFAULT_CURRENCY_OPTIONS, ...options };
  
  // Check if it's a valid currency format
  const currencyRegex = new RegExp(
    `^\\d{1,3}(\\${opts.thousandSeparator}\\d{3})*\\${opts.decimalSeparator}\\d{${opts.decimalPlaces}}$`
  );
  
  return currencyRegex.test(value);
} 