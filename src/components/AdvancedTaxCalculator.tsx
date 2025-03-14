import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Input } from './Input';
import { CustomButton } from './CustomButton';
import { TaxBreakdown } from './TaxBreakdown';
import { calculateTaxDetails } from '../utils/taxCalculations';
import { formatCurrency, roundAndFormat } from '../utils/formatters';
import {
  validateSalary,
  validateTaxCode,
  validatePeriodNumber,
} from '../utils/validation';
import { TaxCodeInput } from './TaxCodeInput';
import { CumulativeToggle } from './CumulativeToggle';
import {
  QuestionMarkCircleIcon,
  CalculatorIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

type CalculatorMode = 'calculator' | 'verification';

export default function AdvancedTaxCalculator() {
  const { t } = useTranslation();

  // Common state
  const [mode, setMode] = useState<CalculatorMode>('calculator');
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
    amount?: string;
  }>({});
  const [calculated, setCalculated] = useState(false);

  // Verification-specific state
  const [earnedAmount, setEarnedAmount] = useState(4166.67); // ~50000/12 default

  const handleCalculate = () => {
    // Validate inputs based on mode
    if (mode === 'calculator') {
      const salaryValidation = validateSalary(salary);
      const taxCodeValidation = validateTaxCode(taxCode);
      const periodValidation = validatePeriodNumber(period, payFrequency);

      setErrors({
        salary: salaryValidation.isValid ? undefined : salaryValidation.message,
        taxCode: taxCodeValidation.isValid
          ? undefined
          : taxCodeValidation.message,
        period: periodValidation.isValid ? undefined : periodValidation.message,
      });

      if (
        salaryValidation.isValid &&
        taxCodeValidation.isValid &&
        periodValidation.isValid
      ) {
        setCalculated(true);
      } else {
        setCalculated(false);
      }
    } else {
      // verification mode
      const amountValidation = validateSalary(earnedAmount);
      const taxCodeValidation = validateTaxCode(taxCode);
      const periodValidation = validatePeriodNumber(period, payFrequency);

      setErrors({
        amount: amountValidation.isValid ? undefined : amountValidation.message,
        taxCode: taxCodeValidation.isValid
          ? undefined
          : taxCodeValidation.message,
        period: periodValidation.isValid ? undefined : periodValidation.message,
      });

      if (
        amountValidation.isValid &&
        taxCodeValidation.isValid &&
        periodValidation.isValid
      ) {
        setCalculated(true);
      } else {
        setCalculated(false);
      }
    }
  };

  // Calculate tax details if input is valid
  const result = calculated
    ? calculateTaxDetails(
        mode === 'calculator'
          ? salary
          : earnedAmount * (payFrequency === 'monthly' ? 12 : 52),
        taxCode,
        isCumulative,
        { type: payFrequency, number: period }
      )
    : null;

  // Calculate current period details
  const currentPeriodDetails = result?.monthlyBreakdown.find(
    (m) =>
      (payFrequency === 'monthly' && m.monthNumber === period) ||
      (payFrequency === 'weekly' && m.monthNumber === Math.ceil(period / 4.33))
  );

  // For verification mode, calculate the expected tax for the period
  const getExpectedTax = () => {
    if (!result) return 0;

    const personalAllowance = 12570;
    const periodAllowance =
      (personalAllowance / (payFrequency === 'monthly' ? 12 : 52)) * period;

    // For verification mode, the amount is what user entered directly
    // For calculator mode, we need to calculate the amount for the period
    const periodAmount =
      mode === 'verification'
        ? earnedAmount
        : (salary / (payFrequency === 'monthly' ? 12 : 52)) * period;

    const taxableAmount = Math.max(0, periodAmount - periodAllowance);

    // This is simplified - in a real app we'd use a more accurate calculation
    // based on exact tax bands and rates
    if (taxableAmount <= 0) return 0;

    // Get the appropriate month's tax from the result
    return currentPeriodDetails?.incomeTax || 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <CardTitle>Advanced Tax Calculator</CardTitle>
            <Tooltip content="Calculate and verify tax for specific pay periods">
              <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>

          {/* Mode selector tabs */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => {
                setMode('calculator');
                setCalculated(false);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-l-md focus:z-10 focus:ring-2 focus:outline-none ${
                mode === 'calculator'
                  ? 'bg-govuk-blue text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } border border-gray-300 dark:border-gray-600`}
            >
              <div className="flex items-center gap-1">
                <CalculatorIcon className="h-4 w-4" />
                <span>Period Calculator</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('verification');
                setCalculated(false);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-r-md focus:z-10 focus:ring-2 focus:outline-none ${
                mode === 'verification'
                  ? 'bg-govuk-blue text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } border border-gray-300 dark:border-gray-600 border-l-0`}
            >
              <div className="flex items-center gap-1">
                <DocumentCheckIcon className="h-4 w-4" />
                <span>Tax Verification</span>
              </div>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <div className="space-y-6">
            {mode === 'calculator' ? (
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
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {payFrequency === 'monthly' ? 'Monthly' : 'Weekly'} Amount
                  Earned
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                      £
                    </span>
                  </div>
                  <Input
                    type="number"
                    value={earnedAmount}
                    onChange={(e) =>
                      setEarnedAmount(parseFloat(e.target.value) || 0)
                    }
                    className="pl-7"
                    error={errors.amount}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter the actual amount you received for this period
                </p>
              </div>
            )}

            <TaxCodeInput value={taxCode} onChange={setTaxCode} />

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
                      setPeriod(1); // Reset period when changing frequency
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
                    {payFrequency === 'monthly'
                      ? 'April (1) to March (12)'
                      : 'Week 1 to Week 52 of tax year'}
                  </p>
                </div>
              </div>
            </div>

            <CustomButton onClick={handleCalculate} className="w-full">
              {mode === 'calculator' ? 'Calculate' : 'Verify Tax'}
            </CustomButton>
          </div>

          {/* Results Section */}
          {calculated && result && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {payFrequency === 'monthly' ? 'Month' : 'Week'} {period}{' '}
                  {mode === 'calculator' ? 'Calculation' : 'Verification'}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {mode === 'calculator' ? 'Gross Pay:' : 'Amount Earned:'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(
                        mode === 'calculator'
                          ? result.annualSummary.gross /
                              (payFrequency === 'monthly' ? 12 : 52)
                          : earnedAmount
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Tax-Free Allowance:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(
                        (12570 / (payFrequency === 'monthly' ? 12 : 52)) *
                          (isCumulative ? period : 1)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Taxable Amount:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(
                        mode === 'calculator'
                          ? currentPeriodDetails?.taxable || 0
                          : Math.max(
                              0,
                              earnedAmount -
                                (12570 /
                                  (payFrequency === 'monthly' ? 12 : 52)) *
                                  (isCumulative ? period : 1)
                            )
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Expected Income Tax:
                    </span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(currentPeriodDetails?.incomeTax || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      National Insurance:
                    </span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {formatCurrency(
                        currentPeriodDetails?.nationalInsurance || 0
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {mode === 'calculator'
                          ? 'Net Pay:'
                          : 'Expected Net Pay:'}
                      </span>
                      <span className="text-base font-bold text-govuk-blue dark:text-govuk-blue">
                        {formatCurrency(currentPeriodDetails?.netPay || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification mode specific details */}
              {mode === 'verification' && (
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Tax Verification
                  </h3>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Expected Tax Rate:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {earnedAmount > 0
                          ? roundAndFormat(
                              ((currentPeriodDetails?.incomeTax || 0) /
                                earnedAmount) *
                                100,
                              1
                            ) + '%'
                          : '0%'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Expected NI Rate:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {earnedAmount > 0
                          ? roundAndFormat(
                              ((currentPeriodDetails?.nationalInsurance || 0) /
                                earnedAmount) *
                                100,
                              1
                            ) + '%'
                          : '0%'}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Expected Take-Home Pay:
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {roundAndFormat(
                          earnedAmount > 0
                            ? ((earnedAmount -
                                (currentPeriodDetails?.incomeTax || 0) -
                                (currentPeriodDetails?.nationalInsurance ||
                                  0)) /
                                earnedAmount) *
                                100
                            : 0,
                          1
                        )}
                        % of gross
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation of calculation method */}
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
}

export { AdvancedTaxCalculator };
