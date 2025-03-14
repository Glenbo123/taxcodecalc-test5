import { useTranslation } from 'react-i18next';
import { MonthlyDetail } from '../types/Breakdowns';
import { formatCurrency } from '../utils/formatters';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

interface WeeklyBreakdownProps {
  monthlyBreakdown: MonthlyDetail[];
  isCumulative: boolean;
  currentPeriod?: { type: 'month' | 'week'; number: number };
  onPeriodChange?: (
    period: { type: 'month' | 'week'; number: number } | undefined
  ) => void;
}

export function WeeklyBreakdown({
  monthlyBreakdown,
  isCumulative,
  currentPeriod,
  onPeriodChange,
}: WeeklyBreakdownProps) {
  const { t } = useTranslation();

  // Convert monthly data to weekly
  const weeklyData = monthlyBreakdown.flatMap((month) => {
    const weeksInMonth = month.monthNumber === 2 ? 4 : 4.33;
    return Array.from({ length: Math.round(weeksInMonth) }, (_, weekIndex) => ({
      weekNumber: Math.round((month.monthNumber - 1) * 4.33 + weekIndex + 1),
      month: month.month,
      gross: month.gross / weeksInMonth,
      taxFree: month.taxFree / weeksInMonth,
      taxable: month.taxable / weeksInMonth,
      incomeTax: isCumulative ? month.incomeTax / weeksInMonth : 0,
      nationalInsurance: month.nationalInsurance / weeksInMonth,
      netPay: month.netPay / weeksInMonth,
    }));
  });

  return (
    <div>
      <div className="px-4 py-3 bg-govuk-grey dark:bg-govuk-blue/50 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('calculator.weeklyBreakdown')}
        </h3>
        <Tooltip content={t('calculator.weeklyBreakdownTooltip')}>
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
                Week
              </th>
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
            {weeklyData.map((week) => (
              <tr
                key={week.weekNumber}
                onClick={() =>
                  onPeriodChange?.(
                    currentPeriod?.type === 'week' &&
                      currentPeriod.number === week.weekNumber
                      ? undefined
                      : { type: 'week', number: week.weekNumber }
                  )
                }
                className={`
                  cursor-pointer transition-colors
                  ${
                    currentPeriod?.type === 'week' &&
                    currentPeriod.number === week.weekNumber
                      ? 'bg-govuk-blue/10 dark:bg-govuk-blue/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }
                `}
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {week.weekNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {week.month}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                  {formatCurrency(week.gross)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                  {formatCurrency(week.taxFree)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                  {formatCurrency(week.taxable)}
                </td>
                <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 text-right font-medium">
                  {formatCurrency(week.incomeTax)}
                </td>
                <td className="px-4 py-3 text-sm text-purple-600 dark:text-purple-400 text-right font-medium">
                  {formatCurrency(week.nationalInsurance)}
                </td>
                <td className="px-4 py-3 text-sm text-govuk-blue dark:text-govuk-blue text-right font-bold">
                  {formatCurrency(week.netPay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeeklyBreakdown;
