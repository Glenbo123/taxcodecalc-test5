import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function getTaxYearData(yearCode: string) {
  const { data: taxYear, error: taxYearError } = await supabase
    .from('tax_years')
    .select('*')
    .eq('year_code', yearCode)
    .single();

  if (taxYearError) throw taxYearError;

  const { data: taxBands, error: taxBandsError } = await supabase
    .from('tax_bands')
    .select('*')
    .eq('tax_year_id', taxYear.id);

  if (taxBandsError) throw taxBandsError;

  const { data: niThresholds, error: niThresholdsError } = await supabase
    .from('ni_thresholds')
    .select('*')
    .eq('tax_year_id', taxYear.id);

  if (niThresholdsError) throw niThresholdsError;

  const { data: niRates, error: niRatesError } = await supabase
    .from('ni_rates')
    .select('*')
    .eq('tax_year_id', taxYear.id);

  if (niRatesError) throw niRatesError;

  return {
    config: {
      yearCode: taxYear.year_code,
      personalAllowance: taxYear.personal_allowance,
      paTaperThreshold: taxYear.pa_taper_threshold,
      paTaperRate: taxYear.pa_taper_rate,
      marriageAllowance: taxYear.marriage_allowance,
    },
    regions: taxBands.reduce((acc, band) => {
      if (!acc[band.region]) {
        acc[band.region] = {
          name: band.region,
          code:
            band.region === 'UK'
              ? 'UK'
              : band.region === 'Scotland'
              ? 'S'
              : 'C',
          bands: [],
        };
      }
      acc[band.region].bands.push({
        band: band.band_name,
        rate: `${band.rate}%`,
        from: band.threshold_from,
        to: band.threshold_to || 'unlimited',
        amount: 0,
        tax: 0,
      });
      return acc;
    }, {} as Record<string, TaxRegion>),
    niThresholds: niThresholds.map((threshold) => ({
      thresholdType: threshold.threshold_type as 'primary' | 'upper',
      weeklyAmount: threshold.weekly_amount,
      monthlyAmount: threshold.monthly_amount,
      annualAmount: threshold.annual_amount,
    })),
    niRates: niRates.map((rate) => ({
      rateType: rate.rate_type as 'main' | 'higher',
      rate: rate.rate,
    })),
  };
}

export async function saveTaxCalculation(calculation: {
  userId: string;
  taxYearId: string;
  region: string;
  grossSalary: number;
  taxCode: string;
  isCumulative: boolean;
  pensionContribution?: number;
  studentLoanPlan?: string;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan?: number;
  pensionRelief?: number;
  netPay: number;
}) {
  const { data, error } = await supabase
    .from('tax_calculations')
    .insert([calculation])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserCalculations(userId: string) {
  const { data, error } = await supabase
    .from('tax_calculations')
    .select(
      `
      *,
      tax_year:tax_years(*)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
