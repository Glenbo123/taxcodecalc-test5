export type IncomeType = 'annual' | 'monthly' | 'weekly' | 'hourly';

export type PaymentFrequency =
  | 'monthly'
  | 'weekly'
  | 'bi-weekly'
  | 'four-weekly';

export interface IncomeSource {
  type:
    | 'salary'
    | 'bonus'
    | 'overtime'
    | 'commission'
    | 'tips'
    | 'investment'
    | 'rental'
    | 'other';
  amount: number;
  frequency: PaymentFrequency;
  description?: string;
  taxable: boolean;
}

export interface IncomeDetails {
  primaryIncome: {
    amount: number;
    frequency: PaymentFrequency;
    hoursPerWeek?: number;
  };
  additionalIncomes: IncomeSource[];
}
