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

export interface CO2Band {
  emissions: number;
  petrol: number;
  diesel: number;
  electric: number;
}

export interface CO2BandsByYear {
  [year: string]: CO2Band[];
}
