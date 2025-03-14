import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from './Input';
import { Card } from './Card';
import { CustomButton } from './CustomButton';
import { calculateTaxDetails } from '../utils/taxCalculations';
import { validateSalary, validateTaxCode } from '../utils/validation';
import { formatCurrency } from '../utils/formatters';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

export function TaxVerificationCalculator() {
  const { t } = useTranslation();
  const [salary, setSalary] = useState(0);
  const [taxCode, setTaxCode] = useState('1257L');
  const [periodType, setPeriodType] = useState<'month' | 'week'>('month');
  const [periodNumber, setPeriodNumber] = useState(1);
  const [errors, setErrors] = useState<{
    salary?: string;
    taxCode?: string;
    periodNumber?: string;
  }>({});

  const handleSalaryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      const validation = validateSalary(value);

      setErrors((prev) => ({
        ...prev,
        salary: validation.isValid ? undefined : validation.message,
      }));

      if (validation.isValid) {
        setSalary(value);
      }
    },
    []
  );

  const handleTaxCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toUpperCase();
      const validation = validateTaxCode(value);

      setErrors((prev) => ({
        ...prev,
        taxCode: validation.isValid ? undefined : validation.message,
      }));

      if (validation.isValid) {
        setTaxCode(value);
      }
    },
    []
  );

  const handlePeriodNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      const maxPeriod = periodType === 'month' ? 12 : 52;

      if (isNaN(value) || value < 1 || value > maxPeriod) {
        setErrors((prev) => ({
          ...prev,
          periodNumber: `Please enter a number between 1 and ${maxPeriod}`,
        }));
        return;
      }

      setErrors((prev) => ({ ...prev, periodNumber: undefined }));
      setPeriodNumber(value);
    },
    [periodType]
  );

  const { annualSummary, incomeTaxBands } = calculateTaxDetails(
    salary,
    taxCode,
    true,
    { type: periodType, number: periodNumber }
  );

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('calculator.verificationCalculator.title')}
          </h3>
          <Tooltip content={t('calculator.verificationCalculator.description')}>
            <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('calculator.verificationCalculator.amountEarned')}
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                  £
                </span>
              </div>
              <Input
                type="number"
                value={salary || ''}
                onChange={handleSalaryChange}
                className="pl-7"
                error={errors.salary}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('calculator.verificationCalculator.taxCodeUsed')}
            </label>
            <Input
              type="text"
              value={taxCode}
              onChange={handleTaxCodeChange}
              className="uppercase"
              error={errors.taxCode}
              maxLength={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('calculator.verificationCalculator.periodType')}
              </label>
              <select
                value={periodType}
                onChange={(e) =>
                  setPeriodType(e.target.value as 'month' | 'week')
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-govuk-blue focus:border-govuk-blue sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="month">Monthly</option>
                <option value="week">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('calculator.verificationCalculator.periodNumber')}
              </label>
              <Input
                type="number"
                value={periodNumber}
                onChange={handlePeriodNumberChange}
                min={1}
                max={periodType === 'month' ? 12 : 52}
                error={errors.periodNumber}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('calculator.verificationCalculator.taxFreeAmount')}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(
                (12570 / (periodType === 'month' ? 12 : 52)) * periodNumber
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('calculator.verificationCalculator.taxableAmount')}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(
                Math.max(
                  0,
                  salary -
                    (12570 / (periodType === 'month' ? 12 : 52)) * periodNumber
                )
              )}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('calculator.verificationCalculator.expectedTax')}
            </span>
            <span className="text-base font-bold text-govuk-blue dark:text-govuk-blue">
              {formatCurrency(annualSummary.totalIncomeTax)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
