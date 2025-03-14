/*
  # Tax System Setup

  1. New Tables
    - tax_years: Stores tax year configurations and rates
    - tax_bands: Stores tax bands for different regions
    - ni_thresholds: Stores National Insurance thresholds
    - ni_rates: Stores National Insurance rates
    - tax_calculations: Stores user tax calculations

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to reference tables
    - Add policies for authenticated users to manage their calculations

  3. Changes
    - Add initial data for 2023-24 and 2024-25 tax years
*/

-- Tax Years table
CREATE TABLE IF NOT EXISTS tax_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_code text NOT NULL UNIQUE,
  personal_allowance numeric(12,2) NOT NULL,
  pa_taper_threshold numeric(12,2) NOT NULL,
  pa_taper_rate numeric(5,2) NOT NULL,
  marriage_allowance numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tax Bands table
CREATE TABLE IF NOT EXISTS tax_bands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_year_id uuid REFERENCES tax_years(id) ON DELETE CASCADE,
  region text NOT NULL CHECK (region IN ('UK', 'Scotland', 'Wales')),
  band_name text NOT NULL,
  rate numeric(5,2) NOT NULL,
  threshold_from numeric(12,2) NOT NULL,
  threshold_to numeric(12,2),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(tax_year_id, region, band_name)
);

-- National Insurance Thresholds
CREATE TABLE IF NOT EXISTS ni_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_year_id uuid REFERENCES tax_years(id) ON DELETE CASCADE,
  threshold_type text NOT NULL CHECK (threshold_type IN ('primary', 'upper')),
  weekly_amount numeric(12,2) NOT NULL,
  monthly_amount numeric(12,2) NOT NULL,
  annual_amount numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(tax_year_id, threshold_type)
);

-- National Insurance Rates
CREATE TABLE IF NOT EXISTS ni_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_year_id uuid REFERENCES tax_years(id) ON DELETE CASCADE,
  rate_type text NOT NULL CHECK (rate_type IN ('main', 'higher')),
  rate numeric(5,2) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(tax_year_id, rate_type)
);

-- Tax Calculations table
CREATE TABLE IF NOT EXISTS tax_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_year_id uuid REFERENCES tax_years(id),
  region text NOT NULL CHECK (region IN ('UK', 'Scotland', 'Wales')),
  gross_salary numeric(12,2) NOT NULL,
  tax_code text NOT NULL,
  is_cumulative boolean DEFAULT true,
  pension_contribution numeric(5,2),
  student_loan_plan text CHECK (student_loan_plan IN ('plan1', 'plan2', 'plan4', 'postgrad')),
  income_tax numeric(12,2) NOT NULL,
  national_insurance numeric(12,2) NOT NULL,
  student_loan numeric(12,2),
  pension_relief numeric(12,2),
  net_pay numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE tax_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE ni_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ni_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies with safety checks
DO $$ 
BEGIN
  -- Tax years policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tax_years' AND policyname = 'Tax years are public readable'
  ) THEN
    CREATE POLICY "Tax years are public readable"
      ON tax_years FOR SELECT TO public USING (true);
  END IF;

  -- Tax bands policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tax_bands' AND policyname = 'Tax bands are public readable'
  ) THEN
    CREATE POLICY "Tax bands are public readable"
      ON tax_bands FOR SELECT TO public USING (true);
  END IF;

  -- NI thresholds policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ni_thresholds' AND policyname = 'NI thresholds are public readable'
  ) THEN
    CREATE POLICY "NI thresholds are public readable"
      ON ni_thresholds FOR SELECT TO public USING (true);
  END IF;

  -- NI rates policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ni_rates' AND policyname = 'NI rates are public readable'
  ) THEN
    CREATE POLICY "NI rates are public readable"
      ON ni_rates FOR SELECT TO public USING (true);
  END IF;

  -- Tax calculations policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tax_calculations' AND policyname = 'Users can read own calculations'
  ) THEN
    CREATE POLICY "Users can read own calculations"
      ON tax_calculations FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tax_calculations' AND policyname = 'Users can create calculations'
  ) THEN
    CREATE POLICY "Users can create calculations"
      ON tax_calculations FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tax_calculations' AND policyname = 'Users can update own calculations'
  ) THEN
    CREATE POLICY "Users can update own calculations"
      ON tax_calculations FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tax_calculations' AND policyname = 'Users can delete own calculations'
  ) THEN
    CREATE POLICY "Users can delete own calculations"
      ON tax_calculations FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create triggers with safety checks
DO $$ 
BEGIN
  -- Only create triggers if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_tax_years_updated_at'
  ) THEN
    CREATE TRIGGER update_tax_years_updated_at
      BEFORE UPDATE ON tax_years
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_tax_bands_updated_at'
  ) THEN
    CREATE TRIGGER update_tax_bands_updated_at
      BEFORE UPDATE ON tax_bands
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_ni_thresholds_updated_at'
  ) THEN
    CREATE TRIGGER update_ni_thresholds_updated_at
      BEFORE UPDATE ON ni_thresholds
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_ni_rates_updated_at'
  ) THEN
    CREATE TRIGGER update_ni_rates_updated_at
      BEFORE UPDATE ON ni_rates
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_tax_calculations_updated_at'
  ) THEN
    CREATE TRIGGER update_tax_calculations_updated_at
      BEFORE UPDATE ON tax_calculations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert initial tax year data if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tax_years WHERE year_code = '2023-24') THEN
    INSERT INTO tax_years (year_code, personal_allowance, pa_taper_threshold, pa_taper_rate, marriage_allowance)
    VALUES ('2023-24', 12570, 100000, 0.5, 1260);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM tax_years WHERE year_code = '2024-25') THEN
    INSERT INTO tax_years (year_code, personal_allowance, pa_taper_threshold, pa_taper_rate, marriage_allowance)
    VALUES ('2024-25', 12570, 100000, 0.5, 1260);
  END IF;
END $$;