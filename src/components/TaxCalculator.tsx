import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { Input } from './Input';
import { TaxBreakdown } from './TaxBreakdown';
import { AnnualSummary } from './AnnualSummary';
import { calculateTaxDetails } from '../utils/taxCalculations';
import { validateSalary, validateTaxCode } from '../utils/validation';
import { CustomButton } from './CustomButton';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

export default function TaxCalculator() {
  const { t } = useTranslation();
  const [salary, setSalary] = useState(50000);
  const [taxCode, setTaxCode] = useState('1257L');
  const [errors, setErrors] = useState<{ salary?: string; taxCode?: string }>(
    {}
  );

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

  const { annualSummary, incomeTaxBands, niBands } = calculateTaxDetails(
    salary,
    taxCode,
    true
  );

  return (
    <Card>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('calculator.annualSalary')}
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
                onChange={handleSalaryChange}
                className="pl-7"
                error={errors.salary}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('calculator.taxCode')}
              </label>
              <Tooltip content="Your tax code determines your tax-free Personal Allowance">
                <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>
            <Input
              type="text"
              value={taxCode}
              onChange={handleTaxCodeChange}
              className="uppercase"
              error={errors.taxCode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TaxBreakdown
              bands={incomeTaxBands}
              totalTax={annualSummary.totalIncomeTax}
              title={t('calculator.incomeTax')}
              colorScheme={{
                headerBg: 'bg-govuk-grey dark:bg-govuk-blue/50',
                rowHoverBg:
                  'hover:bg-govuk-grey/50 dark:hover:bg-govuk-blue/30',
                taxText: 'text-govuk-blue dark:text-govuk-blue',
              }}
            />

            <TaxBreakdown
              bands={niBands}
              totalTax={annualSummary.totalNI}
              title={t('calculator.nationalInsurance')}
              colorScheme={{
                headerBg: 'bg-govuk-grey dark:bg-purple-900/50',
                rowHoverBg:
                  'hover:bg-govuk-grey/50 dark:hover:bg-purple-900/30',
                taxText: 'text-govuk-blue dark:text-purple-400',
              }}
            />
          </div>

          <div>
            <AnnualSummary summary={annualSummary} />
          </div>
        </div>
      </div>
    </Card>
  );
}
