import { IncomeSource } from './IncomeDetails';

export interface Scenario {
  id: string;
  name: string;
  salary: number;
  taxCode: string;
  additionalIncomes: IncomeSource[];
  pensionContribution?: number;
  studentLoan?: {
    plan: 1 | 2 | 4 | 5;
    amount: number;
  };
}

export interface ScenarioComparison {
  id: string;
  name: string;
  scenarios: Scenario[];
  createdAt: Date;
  lastModified: Date;
}
