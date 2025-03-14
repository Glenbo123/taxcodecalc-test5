import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateTaxDetails } from '../utils/taxCalculations';
import { ExportButton } from '../components/ExportButton';

export function Export() {
  const { t } = useTranslation();
  const [salary, setSalary] = useState(50000);
  const [taxCode, setTaxCode] = useState('1257L');

  const { monthlyBreakdown } = calculateTaxDetails(salary, taxCode, true);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('export.title')}
        </h1>

        <div className="space-y-4">
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
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                className="focus:ring-govuk-blue focus:border-govuk-blue block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Enter salary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('calculator.taxCode')}
            </label>
            <input
              type="text"
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value.toUpperCase())}
              className="focus:ring-govuk-blue focus:border-govuk-blue block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white uppercase"
              placeholder="e.g., 1257L"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <ExportButton
              monthlyBreakdown={monthlyBreakdown}
              format="csv"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-govuk-blue hover:bg-govuk-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-govuk-blue"
            />
            <ExportButton
              monthlyBreakdown={monthlyBreakdown}
              format="pdf"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-govuk-blue dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
