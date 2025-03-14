export interface MonthlyDetail {
  month: string;
  monthNumber: number;
  gross: number;
  taxFree: number;
  taxable: number;
  incomeTax: number;
  nationalInsurance: number;
  netPay: number;
}

export interface AnnualSummaryType {
  gross: number;
  netAnnual: number;
  totalIncomeTax: number;
  totalNI: number;
}

export interface TaxCalculationResult {
  annualSummary: AnnualSummaryType;
  monthlyBreakdown: MonthlyDetail[];
  incomeTaxBands: any[]; // Using TaxBand from TaxBands.ts
  niBands: any[]; // Using TaxBand from TaxBands.ts
}
