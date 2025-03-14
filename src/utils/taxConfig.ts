import { TaxRegion } from '../types';

// Tax year configuration for 2023/24
export const TAX_YEAR_CONFIG = {
  year: '2023-24',
  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,
  personalAllowanceTaperRate: 0.5, // £1 reduction for every £2 over threshold
  personalAllowanceTaperMaxIncome: 125140, // Income at which Personal Allowance is fully tapered
  marriageAllowance: 1260,
  studentLoanThresholds: {
    plan1: {
      annual: 22015,
      monthly: 1834.58,
      weekly: 423.36,
    },
    plan2: {
      annual: 27295,
      monthly: 2274.58,
      weekly: 524.9,
    },
    plan4: {
      annual: 27660,
      monthly: 2305,
      weekly: 531.92,
    },
    postgrad: {
      annual: 21000,
      monthly: 1750,
      weekly: 403.85,
    },
  },
};

export const UK_TAX_REGIONS: TaxRegion[] = [
  {
    name: 'England & NI',
    code: 'UK',
    bands: [
      { name: 'Personal Allowance', rate: 0, from: 0, to: 12570 },
      { name: 'Basic Rate', rate: 20, from: 12570, to: 50270 },
      { name: 'Higher Rate', rate: 40, from: 50270, to: 125140 },
      { name: 'Additional Rate', rate: 45, from: 125140, to: 'unlimited' },
    ],
  },
  {
    name: 'Scotland',
    code: 'S',
    bands: [
      { name: 'Personal Allowance', rate: 0, from: 0, to: 12570 },
      { name: 'Starter Rate', rate: 19, from: 12570, to: 14732 },
      { name: 'Basic Rate', rate: 20, from: 14732, to: 25688 },
      { name: 'Intermediate Rate', rate: 21, from: 25688, to: 43662 },
      { name: 'Higher Rate', rate: 42, from: 43662, to: 125140 },
      { name: 'Top Rate', rate: 47, from: 125140, to: 'unlimited' },
    ],
  },
];

export const NI_THRESHOLDS = {
  WEEKLY: {
    PRIMARY_THRESHOLD: 242,
    UPPER_EARNINGS_LIMIT: 967,
  },
  MONTHLY: {
    PRIMARY_THRESHOLD: 1048,
    UPPER_EARNINGS_LIMIT: 4189,
  },
  ANNUAL: {
    PRIMARY_THRESHOLD: 12576,
    UPPER_EARNINGS_LIMIT: 50268,
  },
};

export const NI_RATES = {
  MAIN_RATE: 0.08,
  HIGHER_RATE: 0.02,
};

export const MARRIAGE_ALLOWANCE = {
  TRANSFER_AMOUNT: 1260,
};

export const MONTHS = [
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

export const WEEKS_IN_YEAR = 52;
export const MONTHS_IN_YEAR = 12;
