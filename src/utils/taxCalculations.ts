import { Decimal } from 'decimal.js';
import { debugTax } from './debug';
import { TaxBand, TaxCalculationResult, MonthlyDetail } from '../types';
import { parseTaxCode } from './taxCodeParser';
import {
  preciseAdd,
  preciseSubtract,
  preciseMultiply,
  preciseDivide,
  preciseRound,
} from './precisionCalculations';

// UK Tax bands for 2024/25
const UK_TAX_BANDS: TaxBand[] = [
  {
    band: 'Personal Allowance',
    rate: '0%',
    from: 0,
    to: 12570,
    amount: 0,
    tax: 0,
  },
  {
    band: 'Basic Rate',
    rate: '20%',
    from: 12570,
    to: 50270,
    amount: 0,
    tax: 0,
  },
  {
    band: 'Higher Rate',
    rate: '40%',
    from: 50270,
    to: 125140,
    amount: 0,
    tax: 0,
  },
  {
    band: 'Additional Rate',
    rate: '45%',
    from: 125140,
    to: 'unlimited',
    amount: 0,
    tax: 0,
  },
];

// Scottish Tax bands for 2024/25
const SCOTTISH_TAX_BANDS: TaxBand[] = [
  {
    band: 'Personal Allowance',
    rate: '0%',
    from: 0,
    to: 12570,
    amount: 0,
    tax: 0,
  },
  {
    band: 'Starter Rate',
    rate: '19%',
    from: 12570,
    to: 14732,
    amount: 0,
    tax: 0,
  },
  {
    band: 'Basic Rate',
    rate: '20%',
    from: 14732,
    to: 25688,
    amount: 0,
    tax: 0,
  },
  {
    band: 'Intermediate Rate',
    rate: '21%',
    from: 25688,
    to: 43662,
    amount: 0,
    tax: 0,
  },
  {
    band: 'Higher Rate',
    rate: '42%',
    from: 43662,
    to: 125140,
    amount: 0,
    tax: 0,
  },
  {
    band: 'Top Rate',
    rate: '47%',
    from: 125140,
    to: 'unlimited',
    amount: 0,
    tax: 0,
  },
];

// National Insurance thresholds for 2024/25
const NI_THRESHOLDS = {
  PRIMARY_THRESHOLD: 12570,
  UPPER_EARNINGS_LIMIT: 50270,
};

// National Insurance rates for 2024/25
const NI_RATES = {
  MAIN_RATE: 0.08, // 8% as of 2024/25
  HIGHER_RATE: 0.02,
};

/**
 * Calculates detailed tax information based on annual salary and tax code
 * @param annualSalary The annual salary
 * @param taxCode The tax code
 * @param isCumulative Whether the calculation is cumulative or Week1/Month1
 * @param currentPeriod Optional period details for period-specific calculations
 * @returns Detailed tax calculation results
 */
export function calculateTaxDetails(
  annualSalary: number,
  taxCode: string,
  isCumulative: boolean,
  currentPeriod?: { type: 'month' | 'week'; number: number }
): TaxCalculationResult {
  debugTax('Calculating tax details:', {
    annualSalary,
    taxCode,
    isCumulative,
    currentPeriod,
  });

  // Parse tax code to get personal allowance and other details
  const taxCodeInfo = parseTaxCode(taxCode);
  let personalAllowance = taxCodeInfo.baseAllowance;

  // Adjust personal allowance for high earners (taper £1 for every £2 over £100,000)
  if (annualSalary > 100000) {
    const excessIncome = preciseSubtract(annualSalary, 100000);
    const reduction = Math.min(
      personalAllowance,
      Math.floor(preciseMultiply(excessIncome, 0.5))
    );
    personalAllowance = preciseSubtract(personalAllowance, reduction);
    debugTax('Adjusted personal allowance for high earner:', personalAllowance);
  }

  // Select the correct tax bands based on the tax code
  const taxBands = taxCodeInfo.isScottish
    ? JSON.parse(JSON.stringify(SCOTTISH_TAX_BANDS))
    : JSON.parse(JSON.stringify(UK_TAX_BANDS));

  // Set the actual personal allowance as the upper limit of the first band
  taxBands[0].to = personalAllowance;

  // Calculate tax bands
  const incomeTaxBands = calculateTaxBands(annualSalary, taxBands);
  const totalIncomeTax = incomeTaxBands.reduce(
    (sum, band) => preciseAdd(sum, band.tax),
    0
  );

  // Calculate NI contributions
  const niContributions = calculateNIContributions(annualSalary);
  const totalNI = niContributions.reduce(
    (sum, band) => preciseAdd(sum, band.tax),
    0
  );

  // Calculate monthly breakdown
  const monthlyBreakdown = calculateMonthlyBreakdown(
    annualSalary,
    totalIncomeTax,
    totalNI,
    isCumulative,
    currentPeriod
  );

  return {
    annualSummary: {
      gross: annualSalary,
      totalIncomeTax: preciseRound(totalIncomeTax),
      totalNI: preciseRound(totalNI),
      netAnnual: preciseRound(
        preciseSubtract(annualSalary, preciseAdd(totalIncomeTax, totalNI))
      ),
    },
    monthlyBreakdown,
    incomeTaxBands,
    niBands: niContributions,
  };
}

/**
 * Calculates tax bands based on annual salary and personal allowance
 * @param annualSalary The annual salary
 * @param taxBands The tax bands to use (UK or Scottish)
 * @returns Array of tax bands with amounts and tax calculated
 */
function calculateTaxBands(
  annualSalary: number,
  taxBands: TaxBand[]
): TaxBand[] {
  // Remaining salary to be taxed
  let remainingSalary = annualSalary;

  // Calculate tax for each band
  for (let i = 0; i < taxBands.length; i++) {
    const band = taxBands[i];
    const from = band.from;
    const to = typeof band.to === 'number' ? band.to : Infinity;

    // Calculate band width
    const bandWidth = preciseSubtract(to, from);

    // Calculate amount that falls in this band
    band.amount = Math.max(0, Math.min(remainingSalary, bandWidth));

    // Calculate tax for this band
    const ratePercentage = parseInt(band.rate) / 100;
    band.tax = preciseMultiply(band.amount, ratePercentage);

    // Subtract the amount in this band from the remaining salary
    remainingSalary = preciseSubtract(remainingSalary, band.amount);

    // Log calculation for debugging
    debugTax(
      `Band ${band.band}: Amount: ${band.amount}, Tax: ${band.tax}, Rate: ${band.rate}`
    );

    // If no more salary to tax, break
    if (remainingSalary <= 0) break;
  }

  return taxBands;
}

/**
 * Calculates National Insurance contributions based on annual salary
 * @param annualSalary The annual salary
 * @returns Array of NI bands with amounts and contributions calculated
 */
function calculateNIContributions(annualSalary: number): TaxBand[] {
  // Calculate monthly income for NI calculations
  const monthlyIncome = preciseDivide(annualSalary, 12);

  // Calculate monthly thresholds
  const monthlyPT = preciseDivide(NI_THRESHOLDS.PRIMARY_THRESHOLD, 12);
  const monthlyUEL = preciseDivide(NI_THRESHOLDS.UPPER_EARNINGS_LIMIT, 12);

  // Define NI bands
  const bands: TaxBand[] = [
    {
      band: 'Below Primary Threshold',
      rate: '0%',
      from: 0,
      to: monthlyPT,
      amount: Math.min(monthlyIncome, monthlyPT),
      tax: 0,
    },
    {
      band: 'Main Rate',
      rate: `${NI_RATES.MAIN_RATE * 100}%`,
      from: monthlyPT,
      to: monthlyUEL,
      amount: Math.max(
        0,
        Math.min(monthlyIncome - monthlyPT, monthlyUEL - monthlyPT)
      ),
      tax: 0,
    },
    {
      band: 'Higher Rate',
      rate: `${NI_RATES.HIGHER_RATE * 100}%`,
      from: monthlyUEL,
      to: 'unlimited',
      amount: Math.max(0, monthlyIncome - monthlyUEL),
      tax: 0,
    },
  ];

  // Calculate tax for each band
  bands[1].tax = preciseMultiply(bands[1].amount, NI_RATES.MAIN_RATE);
  bands[2].tax = preciseMultiply(bands[2].amount, NI_RATES.HIGHER_RATE);

  // Convert monthly values to annual
  bands.forEach((band) => {
    band.amount = preciseMultiply(band.amount, 12);
    band.tax = preciseMultiply(band.tax, 12);
    band.from = preciseMultiply(band.from, 12);
    if (band.to !== 'unlimited') {
      band.to = preciseMultiply(band.to as number, 12);
    }
  });

  return bands;
}

/**
 * Calculates monthly breakdown of income, tax, and NI
 * @param annualSalary The annual salary
 * @param totalIncomeTax Total annual income tax
 * @param totalNI Total annual NI contributions
 * @param isCumulative Whether the calculation is cumulative
 * @param currentPeriod Optional current period details
 * @returns Array of monthly details
 */
function calculateMonthlyBreakdown(
  annualSalary: number,
  totalIncomeTax: number,
  totalNI: number,
  isCumulative: boolean,
  currentPeriod?: { type: 'month' | 'week'; number: number }
): MonthlyDetail[] {
  // If there's a specific current period, adjust calculations accordingly
  if (currentPeriod) {
    const { type, number } = currentPeriod;

    if (type === 'month') {
      return calculateMonthlyBreakdownForPeriod(
        annualSalary,
        totalIncomeTax,
        totalNI,
        isCumulative,
        number
      );
    } else {
      // Convert weekly calculations to equivalent monthly periods
      const equivalentMonth = Math.ceil(number / 4.33);
      return calculateMonthlyBreakdownForPeriod(
        annualSalary,
        totalIncomeTax,
        totalNI,
        isCumulative,
        equivalentMonth
      );
    }
  }

  // Default - calculate for all months
  return calculateMonthlyBreakdownForPeriod(
    annualSalary,
    totalIncomeTax,
    totalNI,
    isCumulative,
    12
  );
}

/**
 * Calculates monthly breakdown for a specific period
 * @param annualSalary The annual salary
 * @param totalIncomeTax Total annual income tax
 * @param totalNI Total annual NI contributions
 * @param isCumulative Whether the calculation is cumulative
 * @param targetPeriod The target period number
 * @returns Array of monthly details
 */
function calculateMonthlyBreakdownForPeriod(
  annualSalary: number,
  totalIncomeTax: number,
  totalNI: number,
  isCumulative: boolean,
  targetPeriod: number
): MonthlyDetail[] {
  // Monthly values
  const monthlyGross = preciseDivide(annualSalary, 12);
  const monthlyTaxFree = preciseDivide(12570, 12); // Basic personal allowance
  const monthlyTaxable = preciseSubtract(monthlyGross, monthlyTaxFree);
  const monthlyIncomeTax = preciseDivide(totalIncomeTax, 12);
  const monthlyNI = preciseDivide(totalNI, 12);

  // Create monthly breakdown only for the first targetPeriod months
  return Array.from({ length: targetPeriod }, (_, i) => {
    const month = i + 1;

    // For week/month 1 basis (non-cumulative), calculate tax for each period independently
    const periodIncomeTax = isCumulative
      ? monthlyIncomeTax
      : calculateNonCumulativeTax(month, monthlyTaxable);

    return {
      month: getMonthName(month),
      monthNumber: month,
      gross: preciseRound(monthlyGross),
      taxFree: preciseRound(monthlyTaxFree),
      taxable: preciseRound(monthlyTaxable),
      incomeTax: preciseRound(periodIncomeTax),
      nationalInsurance: preciseRound(monthlyNI),
      netPay: preciseRound(
        preciseSubtract(monthlyGross, preciseAdd(periodIncomeTax, monthlyNI))
      ),
    };
  });
}

/**
 * Calculates non-cumulative tax for a specific period
 * @param month The month number
 * @param monthlyTaxable The monthly taxable amount
 * @returns The calculated tax for this period
 */
function calculateNonCumulativeTax(
  month: number,
  monthlyTaxable: number
): number {
  // This is a simplification - in a real implementation, we would use the exact tax bands for each period
  // For non-cumulative calculations, each period is treated independently
  return monthlyTaxable > 0 ? monthlyTaxable * 0.2 : 0; // Basic rate 20% as simplification
}

/**
 * Gets the name of a month by its number (1-12)
 * @param month Month number (1-12)
 * @returns Month name
 */
function getMonthName(month: number): string {
  const months = [
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
  ];
  return months[(month - 1) % 12];
}
