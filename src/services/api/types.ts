// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Tax rates API types
export interface TaxYear {
  year: string; // e.g., "2023-24"
  personalAllowance: number;
  incomeTaxBands: TaxBand[];
  nationalInsurance: {
    rates: NIRate[];
    thresholds: NIThreshold[];
  };
}

export interface TaxBand {
  name: string;
  rate: number;
  from: number;
  to: number | 'unlimited';
}

export interface NIRate {
  type: string; // e.g., "main", "higher"
  rate: number;
}

export interface NIThreshold {
  name: string; // e.g., "PRIMARY_THRESHOLD", "UPPER_EARNINGS_LIMIT"
  weekly: number;
  monthly: number;
  annual: number;
}

// Car benefit API types
export interface CarBenefitParams {
  taxYear: string;
  listPrice: number;
  co2Emissions: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  rde2Compliant?: boolean;
  electricRange?: number;
  capitalContribution?: number;
  privateFuelProvided?: boolean;
  availableFrom?: string;
  availableTo?: string;
  taxRate: number;
}

export interface CarBenefitResult {
  bikValue: number;
  taxPayable: number;
  appropriatePercentage: number;
  fuelBenefit?: number;
  totalBenefit: number;
  monthlyTaxCost: number;
}

// CO2 bands for car benefits
export interface CO2Band {
  emissions: number;
  petrol: number;
  diesel: number;
  electric: number;
}

export interface CO2BandsByYear {
  [year: string]: CO2Band[];
}

// User data types
export interface SavedCalculation {
  id: string;
  userId?: string;
  type: 'income' | 'car-benefit' | 'comparison';
  name: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  darkMode?: boolean;
  language?: string;
  currencyFormat?: string;
  defaultTaxYear?: string;
}

export interface AuthResponse {
  user: UserProfile;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}
