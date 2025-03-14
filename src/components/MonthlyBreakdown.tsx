import { useTranslation } from 'react-i18next';
import { MonthlyDetail } from '../types/Breakdowns';
import { formatCurrency } from '../utils/formatters';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

interface MonthlyBreakdownProps {
  monthlyBreakdown: MonthlyDetail[];
  currentPeriod?: { type: 'month' | 'week'; number: number };
  onPeriodChange?: (
    period: { type: 'month' | 'week'; number: number } | undefined
  ) => void;
}

export function MonthlyBreakdown({
  monthlyBreakdown,
  currentPeriod,
  onPeriodChange,
}: MonthlyBreakdownProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="px-4 py-3 bg-govuk-grey dark:bg-govuk-blue/50 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('calculator.monthlyBreakdown')}
        </h3>
        <Tooltip content={t('calculator.monthlyBreakdownTooltip')}>
          <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('calculator.month')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('calculator.grossPay')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('calculator.taxFree')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('calculator.taxable')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('calculator.incomeTax')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('calculator.nationalInsurance')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('calculator.netPay')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {monthlyBreakdown.map((month) => (
              <tr
                key={month.monthNumber}
                onClick={() =>
                  onPeriodChange?.(
                    currentPeriod?.type === 'month' &&
                      currentPeriod.number === month.monthNumber
                      ? undefined
                      : { type: 'month', number: month.monthNumber }
                  )
                }
                className={`
                  cursor-pointer transition-colors
                  ${
                    currentPeriod?.type === 'month' &&
                    currentPeriod.number === month.monthNumber
                      ? 'bg-govuk-blue/10 dark:bg-govuk-blue/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }
                `}
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                  {month.month}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                  {formatCurrency(month.gross)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                  {formatCurrency(month.taxFree)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                  {formatCurrency(month.taxable)}
                </td>
                <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 text-right font-medium">
                  {formatCurrency(month.incomeTax)}
                </td>
                <td className="px-4 py-3 text-sm text-purple-600 dark:text-purple-400 text-right font-medium">
                  {formatCurrency(month.nationalInsurance)}
                </td>
                <td className="px-4 py-3 text-sm text-govuk-blue dark:text-govuk-blue text-right font-bold">
                  {formatCurrency(month.netPay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
