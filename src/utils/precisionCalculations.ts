import { Decimal } from 'decimal.js';

// Configure Decimal.js for financial calculations with high precision
// This ensures accurate calculations for tax amounts
Decimal.set({
  precision: 20, // Higher precision to avoid rounding errors
  rounding: Decimal.ROUND_HALF_UP, // Standard financial rounding
  toExpNeg: -7, // Show values in normal notation until very small
  toExpPos: 21, // Show values in normal notation until very large
});

/**
 * Adds two numbers with high precision
 * @param a First number
 * @param b Second number
 * @returns The precise sum
 */
export function preciseAdd(a: number, b: number): number {
  return Number(new Decimal(a).plus(new Decimal(b)));
}

/**
 * Subtracts two numbers with high precision
 * @param a First number (minuend)
 * @param b Second number (subtrahend)
 * @returns The precise difference
 */
export function preciseSubtract(a: number, b: number): number {
  return Number(new Decimal(a).minus(new Decimal(b)));
}

/**
 * Multiplies two numbers with high precision
 * @param a First number
 * @param b Second number
 * @returns The precise product
 */
export function preciseMultiply(a: number, b: number): number {
  return Number(new Decimal(a).times(new Decimal(b)));
}

/**
 * Divides two numbers with high precision
 * @param a Numerator
 * @param b Denominator
 * @returns The precise quotient
 * @throws Error if denominator is zero
 */
export function preciseDivide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return Number(new Decimal(a).dividedBy(new Decimal(b)));
}

/**
 * Rounds a number to specified decimal places with high precision
 * @param n Number to round
 * @param decimalPlaces Number of decimal places (defaults to 2 for money)
 * @returns The rounded number
 */
export function preciseRound(n: number, decimalPlaces: number = 2): number {
  return Number(new Decimal(n).toFixed(decimalPlaces));
}

/**
 * Formats a number as currency with high precision
 * @param amount The amount to format
 * @param currencySymbol The currency symbol (defaults to GBP)
 * @returns Formatted currency string
 */
export function formatPreciseCurrency(
  amount: number,
  currencySymbol: string = '£'
): string {
  const roundedAmount = preciseRound(amount);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundedAmount);
}

/**
 * Calculates percentage with high precision
 * @param amount The amount
 * @param total The total amount
 * @returns The percentage as a number
 */
export function precisePercentage(amount: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return Number(new Decimal(amount).dividedBy(new Decimal(total)).times(100));
}

/**
 * Applies a percentage to an amount with high precision
 * @param amount The base amount
 * @param percentage The percentage to apply
 * @returns The calculated amount
 */
export function preciseApplyPercentage(
  amount: number,
  percentage: number
): number {
  return Number(
    new Decimal(amount).times(new Decimal(percentage)).dividedBy(100)
  );
}

/**
 * Compares two numbers with a small epsilon to handle floating point imprecision
 * @param a First number
 * @param b Second number
 * @param epsilon Maximum allowed difference (defaults to 0.0001)
 * @returns True if the numbers are approximately equal
 */
export function preciseEquals(
  a: number,
  b: number,
  epsilon: number = 0.0001
): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Converts a string to a precise number
 * @param value String value to convert
 * @param defaultValue Default value if conversion fails
 * @returns The converted number or default value
 */
export function parseStringToPreciseNumber(
  value: string,
  defaultValue: number = 0
): number {
  try {
    const trimmed = value.trim();
    if (trimmed === '') return defaultValue;
    return Number(new Decimal(trimmed));
  } catch (error) {
    return defaultValue;
  }
}
