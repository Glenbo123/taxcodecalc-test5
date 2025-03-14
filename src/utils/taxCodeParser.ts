import { TaxCodeInfo } from '../types';

/**
 * Parses a tax code and returns detailed information about its components
 * @param taxCode The tax code to parse
 * @returns Parsed tax code information
 */
export function parseTaxCode(taxCode: string): TaxCodeInfo {
  // Handle empty tax code case
  if (!taxCode || taxCode.trim() === '') {
    return {
      baseAllowance: 12570, // Default personal allowance
      isScottish: false,
      isWelsh: false,
      isNegativeAllowance: false,
      hasMarriageAllowance: false,
      marriageAllowanceAmount: 0,
      specialCodeType: undefined,
      taxRate: undefined,
      isNonCumulative: false,
    };
  }

  const normalizedCode = taxCode.toUpperCase().trim();

  // Check for country prefixes
  const isScottish =
    normalizedCode.startsWith('S') && !normalizedCode.startsWith('SK');
  const isWelsh =
    normalizedCode.startsWith('C') && !normalizedCode.startsWith('CK');

  // Check for K codes (negative allowance)
  const isNegativeAllowance =
    normalizedCode.startsWith('K') ||
    normalizedCode.startsWith('SK') ||
    normalizedCode.startsWith('CK');

  // Check for special tax codes that use flat rates
  let specialCodeType: string | undefined = undefined;
  let taxRate: number | undefined = undefined;
  let baseAllowance = 12570; // Default

  // Handle special tax codes
  if (normalizedCode === 'BR') {
    specialCodeType = 'BR';
    taxRate = 20; // Basic rate
    baseAllowance = 0;
  } else if (normalizedCode === 'D0') {
    specialCodeType = 'D0';
    taxRate = 40; // Higher rate
    baseAllowance = 0;
  } else if (normalizedCode === 'D1') {
    specialCodeType = 'D1';
    taxRate = 45; // Additional rate
    baseAllowance = 0;
  } else if (normalizedCode.includes('NT')) {
    specialCodeType = 'NT';
    taxRate = 0; // No tax
    baseAllowance = Infinity; // Effectively no tax
  } else if (normalizedCode.startsWith('0T')) {
    specialCodeType = '0T';
    baseAllowance = 0; // No personal allowance
  } else {
    // Standard tax code with numbers
    baseAllowance = parseBaseAllowance(normalizedCode);
  }

  // Check for marriage allowance indicators (M or N suffix)
  const hasMarriageAllowance =
    normalizedCode.includes('M') || normalizedCode.includes('N');

  // Marriage allowance amount (recipient gets +1260, transferor gets -1260)
  const marriageAllowanceAmount = hasMarriageAllowance
    ? normalizedCode.includes('M')
      ? 1260
      : -1260
    : 0;

  // Check if non-cumulative (Week 1/Month 1)
  const isNonCumulative =
    normalizedCode.includes('W1') ||
    normalizedCode.includes('M1') ||
    normalizedCode.includes('X');

  return {
    baseAllowance,
    isScottish,
    isWelsh,
    isNegativeAllowance,
    hasMarriageAllowance,
    marriageAllowanceAmount,
    specialCodeType,
    taxRate,
    isNonCumulative,
  };
}

/**
 * Parses the base allowance from a tax code
 * @param code The tax code to parse
 * @returns The base allowance amount
 */
function parseBaseAllowance(code: string): number {
  // Special case for tax codes without numbers
  if (code === 'BR' || code === 'D0' || code === 'D1' || code === 'NT') {
    return 0;
  }

  // Extract the numeric part by removing all non-numeric characters
  // We need special handling for prefixes like S, C, and K
  let cleanCode = code;
  let prefix = '';

  if (cleanCode.startsWith('SK') || cleanCode.startsWith('CK')) {
    prefix = cleanCode.substring(0, 2);
    cleanCode = cleanCode.substring(2);
  } else if (
    cleanCode.startsWith('S') ||
    cleanCode.startsWith('C') ||
    cleanCode.startsWith('K')
  ) {
    prefix = cleanCode.substring(0, 1);
    cleanCode = cleanCode.substring(1);
  }

  // Parse numeric part
  const numericMatch = cleanCode.match(/\d+/);
  if (!numericMatch) {
    return 12570; // Default if no numbers found
  }

  // Tax code numbers are multiplied by 10 to get the actual allowance
  const numericValue = parseInt(numericMatch[0], 10) * 10;

  // For K codes, the allowance is negative
  if (prefix === 'K' || prefix === 'SK' || prefix === 'CK') {
    return -numericValue;
  }

  // For T codes, there might be specific adjustments (simplified here)
  if (cleanCode.includes('T') && !['NT', '0T'].includes(code)) {
    // T codes typically have further calculations, but we'll use the base value
    return numericValue;
  }

  return numericValue;
}

/**
 * Gets a human-readable description of the tax code
 * @param taxCode The tax code to describe
 * @returns A human-readable description
 */
export function getTaxCodeDescription(taxCode: string): string {
  if (!taxCode || taxCode.trim() === '') {
    return '';
  }

  const parsedCode = parseTaxCode(taxCode);
  let description = '';

  if (parsedCode.isScottish) {
    description += 'Scottish rates apply. ';
  } else if (parsedCode.isWelsh) {
    description += 'Welsh rates apply. ';
  }

  if (parsedCode.specialCodeType) {
    switch (parsedCode.specialCodeType) {
      case 'BR':
        description += 'All income taxed at basic rate (20%). ';
        break;
      case 'D0':
        description += 'All income taxed at higher rate (40%). ';
        break;
      case 'D1':
        description += 'All income taxed at additional rate (45%). ';
        break;
      case 'NT':
        description += 'No tax will be deducted. ';
        break;
      case '0T':
        description += 'No personal allowance. ';
        break;
    }
  } else {
    // Standard tax code with an allowance
    if (parsedCode.isNegativeAllowance) {
      description += `K code: £${Math.abs(
        parsedCode.baseAllowance
      ).toLocaleString()} will be added to your taxable income. `;
    } else {
      description += `Personal allowance of £${Math.abs(
        parsedCode.baseAllowance
      ).toLocaleString()}. `;
    }
  }

  if (parsedCode.hasMarriageAllowance) {
    if (parsedCode.marriageAllowanceAmount > 0) {
      description += 'Received marriage allowance from partner. ';
    } else {
      description += 'Transferred marriage allowance to partner. ';
    }
  }

  if (parsedCode.isNonCumulative) {
    description +=
      'Non-cumulative calculation (each pay period calculated independently). ';
  }

  return description.trim();
}

// Export all functions
export default {
  parseTaxCode,
  getTaxCodeDescription,
};
