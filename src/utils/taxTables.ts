import { Decimal } from 'decimal.js';
import { debugTax } from './debug';
import {
  preciseAdd,
  preciseSubtract,
  preciseMultiply,
  preciseDivide,
  preciseRound,
} from './precisionCalculations';
import { parseTaxCode } from './taxCodeParser';

// UK Tax bands for 2023/2024
export const UK_TAX_BANDS = [
  { name: 'Personal Allowance', rate: 0, from: 0, to: 12570 },
  { name: 'Basic Rate', rate: 20, from: 12570, to: 50270 },
  { name: 'Higher Rate', rate: 40, from: 50270, to: 125140 },
  { name: 'Additional Rate', rate: 45, from: 125140, to: Infinity },
];

// Scottish Tax bands for 2023/2024
export const SCOTTISH_TAX_BANDS = [
  { name: 'Personal Allowance', rate: 0, from: 0, to: 12570 },
  { name: 'Starter Rate', rate: 19, from: 12570, to: 14732 },
  { name: 'Basic Rate', rate: 20, from: 14732, to: 25688 },
  { name: 'Intermediate Rate', rate: 21, from: 25688, to: 43662 },
  { name: 'Higher Rate', rate: 42, from: 43662, to: 125140 },
  { name: 'Top Rate', rate: 47, from: 125140, to: Infinity },
];

// NI thresholds for 2023/2024
export const NI_THRESHOLDS = {
  PRIMARY_THRESHOLD: 12570,
  UPPER_EARNINGS_LIMIT: 50270,
};

// NI rates for 2023/2024
export const NI_RATES = {
  MAIN_RATE: 0.08,
  HIGHER_RATE: 0.02,
};

/**
 * Calculates income tax based on annual salary and tax code
 * @param annualSalary Annual salary
 * @param taxCode Tax code
 * @returns Calculated income tax
 */
export function calculateIncomeTax(
  annualSalary: number,
  taxCode: string
): number {
  debugTax(
    'Calculating income tax - salary: %d, taxCode: %s',
    annualSalary,
    taxCode
  );

  // Validate inputs
  if (!annualSalary || isNaN(annualSalary) || annualSalary <= 0) {
    return 0;
  }

  if (!taxCode || taxCode.trim() === '') {
    taxCode = '1257L'; // Default tax code
  }

  // Parse tax code to get allowance and other details
  const taxCodeInfo = parseTaxCode(taxCode);

  // Special tax codes with flat rates
  if (taxCodeInfo.specialCodeType) {
    if (taxCodeInfo.specialCodeType === 'NT') {
      return 0; // No tax
    }
    if (taxCodeInfo.specialCodeType === 'BR') {
      return preciseMultiply(annualSalary, 0.2); // Basic rate only
    }
    if (taxCodeInfo.specialCodeType === 'D0') {
      return preciseMultiply(annualSalary, 0.4); // Higher rate only
    }
    if (taxCodeInfo.specialCodeType === 'D1') {
      return preciseMultiply(annualSalary, 0.45); // Additional rate only
    }
  }

  // Calculate personal allowance and adjust for high income
  let personalAllowance = Math.max(0, taxCodeInfo.baseAllowance);

  // For incomes over £100,000, personal allowance is reduced by £1 for every £2 over £100,000
  if (annualSalary > 100000) {
    const excessIncome = preciseSubtract(annualSalary, 100000);
    const reduction = Math.min(
      personalAllowance,
      Math.floor(preciseDivide(excessIncome, 2))
    );
    personalAllowance = preciseSubtract(personalAllowance, reduction);
  }

  // Select correct tax bands based on tax code
  const taxBands = taxCodeInfo.isScottish ? SCOTTISH_TAX_BANDS : UK_TAX_BANDS;

  // Calculate taxable income
  const taxableIncome = Math.max(
    0,
    preciseSubtract(annualSalary, personalAllowance)
  );

  // Calculate tax for each band
  let totalTax = 0;
  let remainingIncome = taxableIncome;

  for (let i = 1; i < taxBands.length; i++) {
    const band = taxBands[i];
    const prevBand = taxBands[i - 1];

    // Calculate width of this tax band
    const bandWidth = preciseSubtract(band.to, prevBand.to);

    // Calculate income that falls within this band
    const incomeInBand = Math.min(remainingIncome, bandWidth);

    if (incomeInBand <= 0) break;

    // Calculate tax for this band
    const bandTax = preciseMultiply(
      incomeInBand,
      preciseMultiply(band.rate, 0.01)
    );
    totalTax = preciseAdd(totalTax, bandTax);
    remainingIncome = preciseSubtract(remainingIncome, incomeInBand);

    debugTax('Tax band calculation:', {
      bandName: band.name,
      rate: band.rate,
      incomeInBand,
      bandTax,
    });
  }

  return preciseRound(totalTax);
}

/**
 * Calculates National Insurance contributions based on monthly income
 * @param monthlySalary Monthly salary
 * @returns Calculated NI contribution
 */
export function calculateNI(monthlySalary: number): number {
  debugTax('Calculating NI - monthlySalary: %d', monthlySalary);

  // Validate input
  if (!monthlySalary || isNaN(monthlySalary) || monthlySalary <= 0) {
    return 0;
  }

  const monthlyPrimaryThreshold = preciseDivide(
    NI_THRESHOLDS.PRIMARY_THRESHOLD,
    12
  );
  const monthlyUpperLimit = preciseDivide(
    NI_THRESHOLDS.UPPER_EARNINGS_LIMIT,
    12
  );

  let niContribution = 0;

  // Calculate NI on earnings between primary threshold and upper earnings limit
  if (monthlySalary > monthlyPrimaryThreshold) {
    const mainRateEarnings = Math.min(
      preciseSubtract(monthlySalary, monthlyPrimaryThreshold),
      preciseSubtract(monthlyUpperLimit, monthlyPrimaryThreshold)
    );
    niContribution = preciseAdd(
      niContribution,
      preciseMultiply(mainRateEarnings, NI_RATES.MAIN_RATE)
    );
  }

  // Calculate NI on earnings above upper earnings limit
  if (monthlySalary > monthlyUpperLimit) {
    const higherRateEarnings = preciseSubtract(
      monthlySalary,
      monthlyUpperLimit
    );
    niContribution = preciseAdd(
      niContribution,
      preciseMultiply(higherRateEarnings, NI_RATES.HIGHER_RATE)
    );
  }

  return preciseRound(niContribution);
}

/**
 * Calculates total tax (income tax + NI)
 * @param annualSalary Annual salary
 * @param taxCode Tax code
 * @returns Total tax amount
 */
export function calculateTotalTax(
  annualSalary: number,
  taxCode: string
): number {
  // Validate inputs
  if (!annualSalary || isNaN(annualSalary) || annualSalary <= 0) {
    return 0;
  }

  if (!taxCode || taxCode.trim() === '') {
    taxCode = '1257L'; // Default tax code
  }

  const incomeTax = calculateIncomeTax(annualSalary, taxCode);
  const monthlySalary = preciseDivide(annualSalary, 12);
  const monthlyNI = calculateNI(monthlySalary);
  const annualNI = preciseMultiply(monthlyNI, 12);

  return preciseAdd(incomeTax, annualNI);
}

/**
 * Calculates take-home pay after all deductions
 * @param annualSalary Annual salary
 * @param taxCode Tax code
 * @returns Take-home pay
 */
export function calculateTakeHomePay(
  annualSalary: number,
  taxCode: string
): number {
  // Validate inputs
  if (!annualSalary || isNaN(annualSalary) || annualSalary <= 0) {
    return 0;
  }

  if (!taxCode || taxCode.trim() === '') {
    taxCode = '1257L'; // Default tax code
  }

  const totalTax = calculateTotalTax(annualSalary, taxCode);
  return preciseSubtract(annualSalary, totalTax);
}

/**
 * Validates a tax code
 * @param taxCode Tax code to validate
 * @returns True if the tax code is valid
 */
export function isValidTaxCode(taxCode: string): boolean {
  if (!taxCode || taxCode.trim() === '') {
    return false;
  }

  const normalizedCode = taxCode.toUpperCase();

  // Special tax codes (BR, D0, D1, NT, 0T)
  if (normalizedCode.match(/^(BR|D0|D1|NT|0T)$/)) {
    return true;
  }

  // K codes - should NOT have a letter suffix
  if (normalizedCode.match(/^K\d{1,4}$/)) {
    return true;
  }

  // Scottish K codes - should NOT have a letter suffix
  if (normalizedCode.match(/^SK\d{1,4}$/)) {
    return true;
  }

  // Standard UK tax codes (e.g., 1257L)
  if (normalizedCode.match(/^\d{1,4}[TLMNWY](?:1|W1|M1)?$/)) {
    return true;
  }

  // Scottish tax codes (e.g., S1257L)
  if (normalizedCode.match(/^S\d{1,4}[TLMNWY](?:1|W1|M1)?$/)) {
    return true;
  }

  // Welsh tax codes (e.g., C1257L)
  if (normalizedCode.match(/^C\d{1,4}[TLMNWY](?:1|W1|M1)?$/)) {
    return true;
  }

  return false;
}

/**
 * Gets a human-readable description of what a tax code means
 * @param taxCode Tax code to describe
 * @returns Detailed description string
 */
export function getTaxCodeDescription(taxCode: string): string {
  if (!taxCode || taxCode.trim() === '') {
    return 'Standard tax code with default personal allowance';
  }

  const normalizedCode = taxCode.toUpperCase().trim();

  let description = '';

  // Check for country prefixes
  if (normalizedCode.startsWith('S')) {
    description += 'Scottish tax rates apply. ';
  } else if (normalizedCode.startsWith('C')) {
    description += 'Welsh tax rates apply. ';
  }

  // Check for special tax codes
  if (['BR', 'D0', 'D1', 'NT', '0T'].includes(normalizedCode)) {
    if (normalizedCode === 'BR') {
      description += 'All income taxed at basic rate (20%). ';
    } else if (normalizedCode === 'D0') {
      description += 'All income taxed at higher rate (40%). ';
    } else if (normalizedCode === 'D1') {
      description += 'All income taxed at additional rate (45%). ';
    } else if (normalizedCode === 'NT') {
      description += 'No tax will be deducted. ';
    } else if (normalizedCode === '0T') {
      description += 'No personal allowance. ';
    }
  } else {
    // Standard tax code with an allowance
    const isNegativeAllowance = normalizedCode.includes('K');
    if (isNegativeAllowance) {
      description +=
        'Reduced allowance due to benefits or previous underpaid tax (K code). ';
    } else {
      // Extract allowance number
      const numericMatch = normalizedCode.match(/\d+/);
      if (numericMatch) {
        const allowance = parseInt(numericMatch[0], 10) * 10;
        description += `Personal allowance of £${allowance.toLocaleString()}. `;
      }
    }

    // Check for tax code letters
    if (normalizedCode.includes('L')) {
      description += 'Standard tax code. ';
    } else if (normalizedCode.includes('T')) {
      description += 'Your tax calculation includes other calculations. ';
    }
  }

  // Check for marriage allowance
  const hasMarriageAllowance =
    normalizedCode.endsWith('M') || normalizedCode.endsWith('N');
  if (hasMarriageAllowance) {
    if (normalizedCode.endsWith('M')) {
      description += 'You receive Marriage Allowance from your partner. ';
    } else if (normalizedCode.endsWith('N')) {
      description += 'You transfer Marriage Allowance to your partner. ';
    }
  }

  // Check for non-cumulative indicators
  const isNonCumulative =
    normalizedCode.endsWith('W1') ||
    normalizedCode.endsWith('M1') ||
    normalizedCode.includes('X');
  if (isNonCumulative) {
    description +=
      'Non-cumulative calculation (each pay period calculated independently). ';
  }

  return description.trim();
}

/**
 * Legacy function to support older code
 * @param annualSalary Annual salary
 * @param taxCode Tax code
 * @returns Calculated tax as a string
 */
export function calculateTax(annualSalary: number, taxCode: string): string {
  const tax = calculateIncomeTax(annualSalary, taxCode);
  return tax.toString();
}

/**
 * Legacy function to support older code
 * @param annualSalary Annual salary
 * @param taxCode Tax code
 * @returns Tax rate as a string
 */
export function getTaxRate(annualSalary: number, taxCode: string): string {
  const taxCodeInfo = parseTaxCode(taxCode);
  if (taxCodeInfo.specialCodeType) {
    if (taxCodeInfo.specialCodeType === 'BR') return '20%';
    if (taxCodeInfo.specialCodeType === 'D0') return '40%';
    if (taxCodeInfo.specialCodeType === 'D1') return '45%';
    if (taxCodeInfo.specialCodeType === 'NT') return '0%';
  }

  // For regular tax codes, determine the highest rate band that the salary falls into
  const taxBands = taxCodeInfo.isScottish ? SCOTTISH_TAX_BANDS : UK_TAX_BANDS;
  let highestRate = 0;

  for (let i = 0; i < taxBands.length; i++) {
    if (annualSalary > taxBands[i].from) {
      highestRate = taxBands[i].rate;
    }
  }

  return `${highestRate}%`;
}
