import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/formatters';
import { AnnualSummaryType } from '../types/Breakdowns';
import { Tooltip } from './Tooltip';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface AnnualSummaryProps {
  summary: AnnualSummaryType;
}

export function AnnualSummary({ summary }: AnnualSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('calculator.annualSummary')}
        </h2>
        <Tooltip content={t('calculator.annualSummaryTooltip')}>
          <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t('calculator.grossAnnualSalary')}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(summary.gross)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t('calculator.incomeTax')}
          </span>
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            -{formatCurrency(summary.totalIncomeTax)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t('calculator.nationalInsurance')}
          </span>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            -{formatCurrency(summary.totalNI)}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('calculator.netAnnualIncome')}
            </span>
            <span className="text-base font-bold text-govuk-blue dark:text-govuk-blue">
              {formatCurrency(summary.netAnnual)}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
            {((summary.netAnnual / summary.gross) * 100).toFixed(1)}% of gross
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnualSummary;
