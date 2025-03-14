import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Input } from '../components/Input';
import { CustomButton } from '../components/CustomButton';
import { TaxBreakdown } from '../components/TaxBreakdown';
import { calculateTaxDetails } from '../utils/taxCalculations';
import { formatCurrency } from '../utils/formatters';
import { validateSalary, validateTaxCode } from '../utils/validation';
import { TaxCodeInput } from '../components/TaxCodeInput';
import { CumulativeToggle } from '../components/CumulativeToggle';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '../components/Tooltip';
import { TaxCalculationResult, MonthlyBreakdown } from '../types/TaxBands';

const PeriodTaxCalculator = () => {
  const { t } = useTranslation();
  const [salary, setSalary] = useState(50000);
  const [taxCode, setTaxCode] = useState('1257L');
  const [isCumulative, setIsCumulative] = useState(true);
  const [payFrequency, setPayFrequency] = useState<'monthly' | 'weekly'>(
    'monthly'
  );
  const [period, setPeriod] = useState(1);
  const [errors, setErrors] = useState<{
    salary?: string;
    taxCode?: string;
    period?: string;
  }>({});
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    const salaryValidation = validateSalary(salary);
    const taxCodeValidation = validateTaxCode(taxCode);
    const periodError =
      period < 1 || period > (payFrequency === 'monthly' ? 12 : 52)
        ? `Please enter a valid ${payFrequency} period (1-${
            payFrequency === 'monthly' ? 12 : 52
          })`
        : undefined;

    setErrors({
      salary: salaryValidation.isValid ? undefined : salaryValidation.message,
      taxCode: taxCodeValidation.isValid
        ? undefined
        : taxCodeValidation.message,
      period: periodError,
    });

    if (salaryValidation.isValid && taxCodeValidation.isValid && !periodError) {
      setCalculated(true);
    }
  };

  const result = calculated
    ? calculateTaxDetails(salary, taxCode, isCumulative, {
        type: payFrequency === 'monthly' ? 'month' : 'week',
        number: period,
      })
    : null;

  const currentPeriod = result?.monthlyBreakdown[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Period Tax Calculator</CardTitle>
          <Tooltip content="Calculate taxes for a specific payment period (week or month) of the tax year">
            <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Fields */}
          <div className="space-y-6">
            {/* Salary and Tax Code Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Annual Salary
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                      £
                    </span>
                  </div>
                  <Input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                    className="pl-7"
                    error={errors.salary}
                  />
                </div>
              </div>

              <TaxCodeInput value={taxCode} onChange={setTaxCode} />
            </div>

            {/* Cumulative Toggle and Period Selection */}
            <div className="space-y-4">
              <CumulativeToggle
                enabled={isCumulative}
                onChange={setIsCumulative}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pay Frequency
                  </label>
                  <select
                    value={payFrequency}
                    onChange={(e) => {
                      setPayFrequency(e.target.value as 'monthly' | 'weekly');
                      setPeriod(1);
                    }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-govuk-blue focus:border-govuk-blue sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period Number
                  </label>
                  <Input
                    type="number"
                    value={period}
                    onChange={(e) => setPeriod(parseInt(e.target.value) || 1)}
                    min={1}
                    max={payFrequency === 'monthly' ? 12 : 52}
                    error={errors.period}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter a value between 1 and{' '}
                    {payFrequency === 'monthly' ? '12' : '52'}
                  </p>
                </div>
              </div>
            </div>

            <CustomButton onClick={handleCalculate} className="w-full">
              Calculate
            </CustomButton>
          </div>

          {/* Right Column - Results */}
          {calculated && result && currentPeriod && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {payFrequency === 'monthly' ? 'Month' : 'Week'} {period}{' '}
                  Calculation
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Gross Pay:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(currentPeriod.grossPay)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Taxable Income:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(currentPeriod.taxableIncome)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Income Tax:
                    </span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(currentPeriod.incomeTax)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      National Insurance:
                    </span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {formatCurrency(currentPeriod.nationalInsurance)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Net Pay:
                      </span>
                      <span className="text-base font-bold text-govuk-blue dark:text-govuk-blue">
                        {formatCurrency(currentPeriod.netPay)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculation Method Section */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Calculation Method
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {isCumulative
                    ? 'Cumulative calculation considers all earnings since the start of the tax year.'
                    : 'Non-cumulative (Week 1/Month 1) calculation treats each period independently.'}
                </p>

                {isCumulative && (
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <p>
                      For period {period}, the tax-free allowance is calculated
                      as:
                    </p>
                    <p className="pl-4">
                      £12,570 ÷ {payFrequency === 'monthly' ? '12' : '52'} ×{' '}
                      {period} ={' '}
                      {formatCurrency(
                        (12570 / (payFrequency === 'monthly' ? 12 : 52)) *
                          period
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodTaxCalculator;
