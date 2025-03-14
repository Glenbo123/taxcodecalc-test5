import { ValidationResult } from '../types/Validation';
import { preciseEquals } from './precisionCalculations';

/**
 * Validates a salary input
 * @param salary The salary to validate
 * @returns Validation result
 */
export function validateSalary(salary: number | string): ValidationResult {
  const numericSalary =
    typeof salary === 'string' ? parseFloat(salary) : salary;

  if (isNaN(numericSalary)) {
    return {
      isValid: false,
      message: 'Please enter a valid number',
    };
  }

  if (preciseEquals(numericSalary, 0, 0.001)) {
    return {
      isValid: false,
      message: 'Salary must be greater than zero',
    };
  }

  if (numericSalary < 0) {
    return {
      isValid: false,
      message: 'Salary cannot be negative',
    };
  }

  if (numericSalary > 10000000) {
    return {
      isValid: false,
      message: 'Salary exceeds maximum allowed value',
    };
  }

  return { isValid: true };
}

/**
 * Validates a tax code
 * @param taxCode The tax code to validate
 * @returns Validation result
 */
export function validateTaxCode(taxCode: string): ValidationResult {
  if (!taxCode || taxCode.trim() === '') {
    return {
      isValid: false,
      message: 'Tax code is required',
    };
  }

  const normalizedCode = taxCode.toUpperCase().trim();

  // Special tax codes
  if (['BR', 'D0', 'D1', 'NT', '0T'].includes(normalizedCode)) {
    return { isValid: true };
  }

  // K codes (including Scottish K codes) with or without letter suffix
  if (/^(S?K)\d{1,4}([LMNTWY])?$/.test(normalizedCode)) {
    return { isValid: true };
  }

  // Scottish tax codes with optional Week1/Month1 indicator
  if (/^S\d{1,4}[LMNTWY](\s?W1|\s?M1)?$/.test(normalizedCode)) {
    return { isValid: true };
  }

  // Standard tax codes with optional Week1/Month1 indicator
  if (/^\d{1,4}[LMNTWY](\s?W1|\s?M1)?$/.test(normalizedCode)) {
    return { isValid: true };
  }

  // Welsh tax codes
  if (/^C\d{1,4}[LMNTWY](\s?W1|\s?M1)?$/.test(normalizedCode)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: 'Invalid tax code format',
  };
}

/**
 * Validates a pension contribution percentage
 * @param percentage The percentage to validate
 * @returns Validation result
 */
export function validatePensionContribution(
  percentage: number | string
): ValidationResult {
  const numericPercentage =
    typeof percentage === 'string' ? parseFloat(percentage) : percentage;

  if (isNaN(numericPercentage)) {
    return {
      isValid: false,
      message: 'Please enter a valid percentage',
    };
  }

  if (numericPercentage < 0) {
    return {
      isValid: false,
      message: 'Percentage cannot be negative',
    };
  }

  if (numericPercentage > 100) {
    return {
      isValid: false,
      message: 'Percentage cannot exceed 100%',
    };
  }

  return { isValid: true };
}

/**
 * Validates a student loan plan selection
 * @param plan The plan to validate
 * @returns Validation result
 */
export function validateStudentLoanPlan(plan: string): ValidationResult {
  const validPlans = ['plan1', 'plan2', 'plan4', 'postgrad'];

  if (!validPlans.includes(plan)) {
    return {
      isValid: false,
      message: 'Invalid student loan plan',
    };
  }

  return { isValid: true };
}

/**
 * Validates a scenario name
 * @param name The name to validate
 * @returns Validation result
 */
export function validateScenarioName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      message: 'Name is required',
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      message: 'Name cannot exceed 50 characters',
    };
  }

  return { isValid: true };
}

/**
 * Validates a period number
 * @param period The period number
 * @param periodType The type of period ('month' or 'week')
 * @returns Validation result
 */
export function validatePeriodNumber(
  period: number,
  periodType: 'month' | 'week'
): ValidationResult {
  const maxPeriod = periodType === 'month' ? 12 : 52;

  if (isNaN(period)) {
    return {
      isValid: false,
      message: 'Please enter a valid number',
    };
  }

  if (period < 1 || period > maxPeriod) {
    return {
      isValid: false,
      message: `Period must be between 1 and ${maxPeriod}`,
    };
  }

  return { isValid: true };
}

/**
 * Validates a number is within a specific range
 * @param value The value to validate
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @param fieldName Name of the field for error message
 * @returns Validation result
 */
export function validateNumberInRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult {
  if (isNaN(value)) {
    return {
      isValid: false,
      message: `${fieldName} must be a valid number`,
    };
  }

  if (value < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min}`,
    };
  }

  if (value > max) {
    return {
      isValid: false,
      message: `${fieldName} cannot exceed ${max}`,
    };
  }

  return { isValid: true };
}
