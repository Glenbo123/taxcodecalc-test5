import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from './Input';
import { validateTaxCode } from '../utils/validation';
import { getTaxCodeDescription } from '../utils/taxCodeParser';
import {
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface TaxCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaxCodeInput({ value, onChange }: TaxCodeInputProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string>();
  const [description, setDescription] = useState(() =>
    getTaxCodeDescription(value)
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTaxCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.toUpperCase();
      const validation = validateTaxCode(newValue);

      setError(validation.isValid ? undefined : validation.message);

      if (validation.isValid || newValue === '') {
        onChange(newValue);
      }
    },
    [onChange]
  );

  // Update description when value changes (either from input or dropdown)
  useEffect(() => {
    setDescription(getTaxCodeDescription(value));
    const validation = validateTaxCode(value);
    setError(validation.isValid ? undefined : validation.message);
  }, [value]);

  const handleClear = () => {
    onChange('1257L');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectChange = (newTaxCode: string) => {
    onChange(newTaxCode);
  };

  const commonTaxCodes = [
    { code: '1257L', description: 'Standard tax code' },
    { code: 'S1257L', description: 'Scottish tax code' },
    { code: 'BR', description: 'All income taxed at basic rate' },
    { code: 'D0', description: 'All income taxed at higher rate' },
    { code: 'NT', description: 'No tax to be deducted' },
    { code: 'K1000', description: 'Reduced allowance (K code)' },
    { code: 'SK1000', description: 'Scottish reduced allowance' },
    { code: '1257M', description: 'Marriage allowance recipient' },
    { code: '1257N', description: 'Marriage allowance transferor' },
    { code: '1257L W1', description: 'Emergency Week 1 basis' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('calculator.taxCode')}
        </label>
        <Tooltip content="Your tax code determines your tax-free Personal Allowance. Common codes include 1257L (standard), S1257L (Scottish), K codes for reduced allowance, and BR/D0/NT for specific tax rates.">
          <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>

      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleTaxCodeChange}
              className="uppercase pr-8"
              error={error}
              maxLength={7}
              aria-label={t('calculator.taxCode')}
            />
            {value && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Clear tax code"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <Select.Root value={value} onValueChange={handleSelectChange}>
            <Select.Trigger
              className="inline-flex items-center justify-center rounded-md px-3 text-sm leading-6 gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-govuk-blue"
              aria-label="Select tax code"
            >
              <Select.Value placeholder="Select" />
              <Select.Icon>
                <ChevronDownIcon className="h-4 w-4" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-800 cursor-default">
                  <ChevronDownIcon className="h-4 w-4 rotate-180" />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <Select.Group>
                    <Select.Label className="px-6 py-1.5 text-xs text-gray-500 dark:text-gray-400">
                      Common Tax Codes
                    </Select.Label>
                    {commonTaxCodes.map((taxCode) => (
                      <Select.Item
                        key={taxCode.code}
                        value={taxCode.code}
                        className="relative flex items-center px-8 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-sm hover:bg-govuk-blue/10 dark:hover:bg-govuk-blue/20 cursor-pointer outline-none"
                      >
                        <Select.ItemText>{taxCode.code}</Select.ItemText>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {taxCode.description}
                        </span>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-800 cursor-default">
                  <ChevronDownIcon className="h-4 w-4" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      {!error && description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}
