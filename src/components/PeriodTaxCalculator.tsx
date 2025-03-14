import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Input } from './Input';
import { CustomButton } from './CustomButton';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { validateSalary, validateTaxCode } from '../utils/validation';
import { TaxCodeInput } from './TaxCodeInput';
import { CumulativeToggle } from './CumulativeToggle';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';
import { parseTaxCode } from '../utils/taxCodeParser';
import { calculateTaxDetails } from '../utils/taxCalculations';
import type { TaxCalculationResult } from '../types/TaxBands';

const PeriodTaxCalculator = () => {
  // Remove unused t declaration
  useTranslation(); // Keep the hook if you need translations later
  // ... rest of your component code
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
    } else {
      setCalculated(false);
    }
  };

  const result: TaxCalculationResult | null = calculated
    ? calculateTaxDetails(salary, taxCode, isCumulative, {
        type: payFrequency === 'monthly' ? 'month' : 'week',
        number: period,
      })
    : null;

  const taxCodeInfo = parseTaxCode(taxCode);
  const isScottish = taxCodeInfo.isScottish;

  const getPeriodText = () => {
    if (payFrequency === 'monthly') {
      const months = [
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
      return months[period - 1];
    } else {
      return `Week ${period}`;
    }
  };

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
          <div className="space-y-6">
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

          {calculated && result && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>{getPeriodText()} Calculation</span>
                  {isScottish && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400">
                      Scottish Rates
                    </span>
                  )}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Gross Pay:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(result.monthlyBreakdown[0].grossPay)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Taxable Income:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(result.monthlyBreakdown[0].taxableIncome)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Income Tax:
                    </span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(result.monthlyBreakdown[0].incomeTax)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      National Insurance:
                    </span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {formatCurrency(
                        result.monthlyBreakdown[0].nationalInsurance
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Net Pay:
                      </span>
                      <span className="text-base font-bold text-govuk-blue dark:text-govuk-blue">
                        {formatCurrency(result.monthlyBreakdown[0].netPay)}
                      </span>
                    </div>
                    <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                      {formatPercentage(
                        (result.monthlyBreakdown[0].netPay /
                          result.monthlyBreakdown[0].grossPay) *
                          100
                      )}{' '}
                      of gross
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Tax Breakdown
                </h3>

                <div className="space-y-3 mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {isScottish
                      ? 'Scottish tax rates applied based on your tax code.'
                      : 'UK tax rates applied based on your tax code.'}
                  </p>

                  {result.taxBands.map(
                    (band, index) =>
                      band.amount > 0 && (
                        <div key={index} className="pb-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {band.band} ({band.rate}):
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(band.tax)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full"
                              style={{
                                width: `${
                                  (band.amount / result.grossSalary) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{formatCurrency(band.from)}</span>
                            <span>
                              {band.to === 'unlimited'
                                ? 'No limit'
                                : formatCurrency(band.to as number)}
                            </span>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>

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
