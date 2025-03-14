import { useTranslation } from 'react-i18next';
import { TaxBand } from '../types';
import { formatCurrency } from '../utils/formatters';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

interface TaxBreakdownProps {
  bands: TaxBand[];
  totalTax: number;
  title: string;
  colorScheme: {
    headerBg: string;
    rowHoverBg: string;
    taxText: string;
  };
  isScottish?: boolean;
}

export function TaxBreakdown({
  bands,
  totalTax,
  title,
  colorScheme,
  isScottish = false,
}: TaxBreakdownProps) {
  const { t } = useTranslation();

  // Filter out bands with zero amount
  const activeBands = bands.filter((band) => band.amount > 0);

  const getTaxRateTooltip = (band: TaxBand) => {
    return `Tax band: ${band.from} to ${
      band.to === 'unlimited' ? 'unlimited' : formatCurrency(band.to as number)
    }. 
    Rate: ${band.rate}. Amount in this band: ${formatCurrency(band.amount)}. 
    Tax: ${formatCurrency(band.tax)}.`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div
        className={`px-4 py-3 ${colorScheme.headerBg} rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          {isScottish && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400">
              Scottish
            </span>
          )}
        </div>
        <Tooltip
          content={`Total ${title.toLowerCase()}: ${formatCurrency(
            totalTax
          )}. Click on a band for details.`}
        >
          <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>

      <div className="p-4">
        {/* Visual tax band representation */}
        <div className="mb-4">
          <div className="h-8 flex rounded-md overflow-hidden">
            {activeBands.map((band, index) => {
              // Calculate percentage of total income that this band represents
              const totalAmount = bands.reduce((sum, b) => sum + b.amount, 0);
              const percentage =
                totalAmount > 0 ? (band.amount / totalAmount) * 100 : 0;

              // Generate a color based on the band rate
              const bandColors = {
                'Personal Allowance': 'bg-green-500 dark:bg-green-700',
                'Starter Rate': 'bg-blue-400 dark:bg-blue-600',
                'Basic Rate': 'bg-blue-500 dark:bg-blue-700',
                'Intermediate Rate': 'bg-purple-400 dark:bg-purple-600',
                'Higher Rate': 'bg-purple-500 dark:bg-purple-700',
                'Additional Rate': 'bg-red-500 dark:bg-red-700',
                'Top Rate': 'bg-red-600 dark:bg-red-800',
                'Below Primary Threshold': 'bg-green-500 dark:bg-green-700',
                'Main Rate': 'bg-blue-500 dark:bg-blue-700',

                // Default color fallback
                default: 'bg-gray-500 dark:bg-gray-700',
              };

              const bgColor =
                bandColors[band.band as keyof typeof bandColors] ||
                bandColors.default;

              return (
                <Tooltip key={index} content={getTaxRateTooltip(band)}>
                  <div
                    className={`${bgColor} flex items-center justify-center text-white text-xs`}
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage >= 10 && band.rate}
                  </div>
                </Tooltip>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>£0</span>
            <span>
              {formatCurrency(
                bands.reduce(
                  (max, band) =>
                    band.to !== 'unlimited'
                      ? Math.max(max, band.to as number)
                      : max,
                  0
                )
              )}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('calculator.band')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('calculator.rate')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('calculator.from')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('calculator.to')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('calculator.amountInBand')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('calculator.tax')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bands.map((band, _index) => (
                <tr
                  key={band.band}
                  className={`${colorScheme.rowHoverBg} transition-colors`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {band.band}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {band.rate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(band.from)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {band.to === 'unlimited'
                      ? t('calculator.noLimit')
                      : formatCurrency(band.to)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                    {formatCurrency(band.amount)}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm ${colorScheme.taxText} text-right font-medium`}
                  >
                    {formatCurrency(band.tax)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 dark:border-gray-700">
                <td
                  colSpan={5}
                  className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t('calculator.total')}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${colorScheme.taxText} text-right font-bold`}
                >
                  {formatCurrency(totalTax)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
export default TaxBreakdown;
