import { formatPreciseCurrency } from './precisionCalculations';

/**
 * Formats a number as currency
 * @param amount Amount to format
 * @param currencySymbol Optional currency symbol (defaults to GBP £)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currencySymbol?: string
): string => {
  return formatPreciseCurrency(amount, currencySymbol);
};

/**
 * Formats a percentage
 * @param value Percentage value (0-100)
 * @param decimalPlaces Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimalPlaces: number = 1
): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Formats a number with thousands separators
 * @param value Number to format
 * @param decimalPlaces Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  decimalPlaces: number = 0
): string => {
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

/**
 * Formats a date
 * @param date Date to format
 * @param format Format style ('short', 'medium', 'long', 'full')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string => {
  const options: Intl.DateTimeFormatOptions = { dateStyle: format };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

/**
 * Rounds a number to a specified number of decimal places and formats it
 * @param value Number to round and format
 * @param decimalPlaces Number of decimal places
 * @returns Formatted number string
 */
export const roundAndFormat = (
  value: number,
  decimalPlaces: number = 2
): string => {
  const factor = Math.pow(10, decimalPlaces);
  const rounded = Math.round(value * factor) / factor;
  return rounded.toFixed(decimalPlaces);
};
