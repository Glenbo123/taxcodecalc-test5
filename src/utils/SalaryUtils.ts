import { Decimal } from 'decimal.js';

/**
 * Converts salary amounts to yearly equivalents
 * @param amount The salary amount to convert
 * @param period The period of the salary (hourly, daily, monthly, yearly)
 * @param hoursPerWeek Optional hours per week for hourly calculations (defaults to 40)
 * @returns The yearly equivalent salary
 */
export const convertToYearly = (
  amount: number,
  period: 'hourly' | 'daily' | 'monthly' | 'yearly',
  hoursPerWeek: number = 40
): number => {
  if (!amount || isNaN(amount)) return 0;

  const decimalAmount = new Decimal(amount);
  switch (period) {
    case 'hourly':
      return Number(decimalAmount.times(hoursPerWeek).times(52).toFixed(2)); // Custom hours a week, 52 weeks a year
    case 'daily':
      return Number(decimalAmount.times(260).toFixed(2)); // 5 days a week, 52 weeks a year
    case 'monthly':
      return Number(decimalAmount.times(12).toFixed(2)); // 12 months in a year
    case 'yearly':
    default:
      return Number(decimalAmount.toFixed(2));
  }
};

/**
 * Converts yearly salary to monthly equivalent
 * @param yearlyAmount The yearly salary
 * @returns The monthly equivalent
 */
export const convertToMonthly = (yearlyAmount: number): number => {
  if (!yearlyAmount || isNaN(yearlyAmount)) return 0;
  return Number(new Decimal(yearlyAmount).div(12).toFixed(2));
};

/**
 * Converts yearly salary to weekly equivalent
 * @param yearlyAmount The yearly salary
 * @returns The weekly equivalent
 */
export const convertToWeekly = (yearlyAmount: number): number => {
  if (!yearlyAmount || isNaN(yearlyAmount)) return 0;
  return Number(new Decimal(yearlyAmount).div(52).toFixed(2));
};

/**
 * Converts yearly salary to daily equivalent (based on 5-day work week)
 * @param yearlyAmount The yearly salary
 * @returns The daily equivalent
 */
export const convertToDaily = (yearlyAmount: number): number => {
  if (!yearlyAmount || isNaN(yearlyAmount)) return 0;
  return Number(new Decimal(yearlyAmount).div(260).toFixed(2));
};

/**
 * Converts yearly salary to hourly equivalent
 * @param yearlyAmount The yearly salary
 * @param hoursPerWeek Optional hours per week (defaults to 40)
 * @returns The hourly equivalent
 */
export const convertToHourly = (
  yearlyAmount: number,
  hoursPerWeek: number = 40
): number => {
  if (
    !yearlyAmount ||
    isNaN(yearlyAmount) ||
    !hoursPerWeek ||
    hoursPerWeek <= 0
  )
    return 0;
  return Number(new Decimal(yearlyAmount).div(52).div(hoursPerWeek).toFixed(2));
};

/**
 * Rounds a number to the nearest penny
 * @param amount The amount to round
 * @returns The rounded amount
 */
export const roundToNearestPenny = (amount: number): number => {
  if (!amount || isNaN(amount)) return 0;
  return Number(new Decimal(amount).toFixed(2));
};

/**
 * Validates salary input
 * @param amount The salary amount to validate
 * @param maxAmount Optional maximum allowed salary (defaults to 10,000,000)
 * @returns True if the salary is valid
 */
export const validateSalaryInput = (
  amount: number,
  maxAmount: number = 10000000
): boolean => {
  if (!amount || isNaN(amount)) return false;
  return amount > 0 && amount <= maxAmount;
};

/**
 * Formats a number as a GBP currency string
 * @param amount The amount to format
 * @returns The formatted currency string
 */
export const formatGBP = (amount: number): string => {
  if (!amount || isNaN(amount)) return '£0.00';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
