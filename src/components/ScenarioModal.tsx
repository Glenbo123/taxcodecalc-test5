import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { Input } from './Input';
import { CustomButton } from './CustomButton';
import { Scenario } from '../types';
import { validateSalary, validateTaxCode } from '../utils/validation';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scenario: Scenario) => void;
  initialData?: Scenario;
}

export function ScenarioModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ScenarioModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Scenario>({
    id: '',
    name: '',
    salary: 50000,
    taxCode: '1257L',
    additionalIncomes: [],
    pensionContribution: 0,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    salary?: string;
    taxCode?: string;
    pensionContribution?: string;
  }>({});

  // Initialize form with initialData if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        name: '',
        salary: 50000,
        taxCode: '1257L',
        additionalIncomes: [],
        pensionContribution: 0,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field: keyof Scenario, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = () => {
    // Validate form
    const validationErrors: typeof errors = {};

    if (!formData.name.trim()) {
      validationErrors.name = 'Name is required';
    }

    const salaryValidation = validateSalary(formData.salary);
    if (!salaryValidation.isValid) {
      validationErrors.salary = salaryValidation.message;
    }

    const taxCodeValidation = validateTaxCode(formData.taxCode);
    if (!taxCodeValidation.isValid) {
      validationErrors.taxCode = taxCodeValidation.message;
    }

    if (formData.pensionContribution !== undefined) {
      if (
        formData.pensionContribution < 0 ||
        formData.pensionContribution > 100
      ) {
        validationErrors.pensionContribution =
          'Pension contribution must be between 0 and 100%';
      }
    }

    setErrors(validationErrors);

    // Submit if no errors
    if (Object.keys(validationErrors).length === 0) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full rounded-xl bg-white dark:bg-gray-800 shadow-xl p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {initialData
              ? t('scenarios.editScenario')
              : t('scenarios.addScenario')}
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('scenarios.scenarioName')}
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
              />
            </div>

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
                  value={formData.salary}
                  onChange={(e) =>
                    handleChange('salary', parseFloat(e.target.value) || 0)
                  }
                  className="pl-7"
                  error={errors.salary}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('calculator.taxCode')}
              </label>
              <Input
                type="text"
                value={formData.taxCode}
                onChange={(e) =>
                  handleChange('taxCode', e.target.value.toUpperCase())
                }
                className="uppercase"
                error={errors.taxCode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pension Contribution (%)
              </label>
              <Input
                type="number"
                value={formData.pensionContribution || 0}
                onChange={(e) =>
                  handleChange(
                    'pensionContribution',
                    parseFloat(e.target.value) || 0
                  )
                }
                min={0}
                max={100}
                error={errors.pensionContribution}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter percentage of salary contributed to pension
              </p>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <CustomButton variant="secondary" onClick={onClose}>
                {t('common.cancel')}
              </CustomButton>
              <CustomButton onClick={handleSubmit}>
                {t('common.save')}
              </CustomButton>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ScenarioModal;
