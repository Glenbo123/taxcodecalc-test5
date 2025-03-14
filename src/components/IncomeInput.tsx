import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from './Input';
import { validateSalary } from '../utils/validation';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

interface IncomeInputProps {
  onIncomeChange: (amount: number) => void;
}

export function IncomeInput({ onIncomeChange }: IncomeInputProps) {
  const { t } = useTranslation();
  const [salary, setSalary] = useState(50000);
  const [error, setError] = useState<string>();

  const handleSalaryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      const validation = validateSalary(value);

      setError(validation.isValid ? undefined : validation.message);

      if (validation.isValid) {
        setSalary(value);
        onIncomeChange(value);
      }
    },
    [onIncomeChange]
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('calculator.annualSalary')}
        </label>
        <Tooltip content="Enter your annual gross salary before tax and other deductions">
          <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">£</span>
        </div>
        <Input
          type="number"
          value={salary}
          onChange={handleSalaryChange}
          className="pl-7"
          error={error}
          min={0}
          max={10000000}
          step={1000}
          aria-label={t('calculator.annualSalary')}
        />
      </div>
    </div>
  );
}
