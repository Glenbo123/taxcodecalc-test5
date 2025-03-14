import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TaxBreakdown } from '../components/TaxBreakdown';
import { MonthlyBreakdown } from '../components/MonthlyBreakdown';
import { WeeklyBreakdown } from '../components/WeeklyBreakdown';
import { AnnualSummary } from '../components/AnnualSummary';
import { IncomeInput } from '../components/IncomeInput';
import { TaxCodeInput } from '../components/TaxCodeInput';
import { CumulativeToggle } from '../components/CumulativeToggle';
import { TaxVerificationCalculator } from '../components/TaxVerificationCalculator';
import TaxCalculator from '../components/TaxCalculator';
import { calculateTaxDetails } from '../utils/taxCalculations';
import { Tab } from '@headlessui/react';
import { clsx } from 'clsx';
import { debounce } from 'lodash';

export function Calculator() {
  const { t } = useTranslation();
  const [salary, setSalary] = useState(50000);
  const [taxCode, setTaxCode] = useState('1257L');
  const [isCumulative, setIsCumulative] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState<
    { type: 'month' | 'week'; number: number } | undefined
  >();

  const { annualSummary, monthlyBreakdown, incomeTaxBands, niBands } = useMemo(
    () => calculateTaxDetails(salary, taxCode, isCumulative, currentPeriod),
    [salary, taxCode, isCumulative, currentPeriod]
  );

  const handleIncomeChange = useMemo(
    () =>
      debounce((amount: number) => {
        setSalary(amount);
      }, 300),
    []
  );

  const handleTaxCodeChange = useMemo(
    () =>
      debounce((code: string) => {
        setTaxCode(code);
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      handleIncomeChange.cancel();
      handleTaxCodeChange.cancel();
    };
  }, [handleIncomeChange, handleTaxCodeChange]);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IncomeInput onIncomeChange={handleIncomeChange} />
          <div className="space-y-4">
            <TaxCodeInput value={taxCode} onChange={handleTaxCodeChange} />
            <CumulativeToggle
              enabled={isCumulative}
              onChange={setIsCumulative}
            />
          </div>
        </div>
      </div>

      <TaxCalculator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-lg bg-govuk-blue/20 p-1">
              {[
                t('calculator.taxBreakdown'),
                t('calculator.monthlyBreakdown'),
                t('calculator.weeklyBreakdown'),
              ].map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    clsx(
                      'w-full rounded-md py-2.5 text-govuk-body-s govuk-mobile:text-govuk-s font-medium leading-5',
                      'ring-white/60 ring-offset-2 ring-offset-govuk-blue focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-govuk-blue shadow dark:bg-primary-900 dark:text-white'
                        : 'text-govuk-blue/70 hover:bg-white/[0.12] hover:text-govuk-blue'
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-4">
              <Tab.Panel>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
              </Tab.Panel>
              <Tab.Panel>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <MonthlyBreakdown
                    monthlyBreakdown={monthlyBreakdown}
                    currentPeriod={currentPeriod}
                    onPeriodChange={setCurrentPeriod}
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <WeeklyBreakdown
                    monthlyBreakdown={monthlyBreakdown}
                    isCumulative={isCumulative}
                    currentPeriod={currentPeriod}
                    onPeriodChange={setCurrentPeriod}
                  />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <AnnualSummary summary={annualSummary} />
          </div>
          <TaxVerificationCalculator />
        </div>
      </div>
    </div>
  );
}
