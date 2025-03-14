export interface TaxBand {
  band: string;
  rate: string;
  from: number;
  to: number | 'unlimited';
  amount: number;
  tax: number;
}

export interface TaxYearConfig {
  yearCode: string;
  personalAllowance: number;
  paTaperThreshold: number;
  paTaperRate: number;
  marriageAllowance: number;
}

export interface TaxRegion {
  name: string;
  code: string;
  bands: TaxBand[];
}

export interface NIThreshold {
  thresholdType: 'primary' | 'upper';
  weeklyAmount: number;
  monthlyAmount: number;
  annualAmount: number;
}

export interface NIRate {
  rateType: 'main' | 'higher';
  rate: number;
}

export interface TaxYearData {
  config: TaxYearConfig;
  regions: Record<string, TaxRegion>;
  niThresholds: NIThreshold[];
  niRates: NIRate[];
}

export interface TaxCalculationResult {
  grossSalary: number;
  taxableIncome: number;
  personalAllowance: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan?: number;
  pensionRelief?: number;
  netPay: number;
  taxBands: TaxBand[];
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface MonthlyBreakdown {
  month: number;
  grossPay: number;
  taxableIncome: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan?: number;
  pensionContribution?: number;
  netPay: number;
}

export interface TaxCodeInfo {
  baseAllowance: number;
  isScottish: boolean;
  isWelsh?: boolean;
  isNegativeAllowance: boolean;
  hasMarriageAllowance: boolean;
  marriageAllowanceAmount?: number;
  specialCodeType?: string;
  taxRate?: number;
  isNonCumulative?: boolean;
}
