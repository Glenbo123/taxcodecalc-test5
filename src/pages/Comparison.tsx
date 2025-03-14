import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScenarioModal } from '../components/ScenarioModal';
import {
  PlusIcon,
  ArrowsRightLeftIcon,
  InformationCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { calculateTaxDetails } from '../utils/taxCalculations';
import { formatCurrency } from '../utils/formatters';
import { CustomButton } from '../components/CustomButton';
import { Tooltip } from '../components/Tooltip';
import { useNavigate } from 'react-router-dom';
import TaxSavingTips from '../components/TaxSavingTips';
import { Scenario } from '../types';

export function Comparison() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<
    Scenario | undefined
  >();
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: crypto.randomUUID(),
      name: t('scenarios.current'),
      salary: 50000,
      taxCode: '1257L',
      additionalIncomes: [],
      pensionContribution: 0,
    },
  ]);
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');

  // Load scenarios from localStorage if available
  useEffect(() => {
    const savedScenarios = localStorage.getItem('tax-scenarios');
    if (savedScenarios) {
      try {
        const parsed = JSON.parse(savedScenarios);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setScenarios(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved scenarios:', e);
      }
    }
  }, []);

  // Save scenarios to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tax-scenarios', JSON.stringify(scenarios));
  }, [scenarios]);

  const handleSaveScenario = (scenario: Scenario) => {
    if (editingScenario) {
      setScenarios(scenarios.map((s) => (s.id === scenario.id ? scenario : s)));
    } else {
      setScenarios([...scenarios, scenario]);
    }
    setEditingScenario(undefined);
    setIsModalOpen(false);
  };

  const handleEditScenario = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setIsModalOpen(true);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const handleDuplicateScenario = (scenario: Scenario) => {
    const newScenario = {
      ...scenario,
      id: crypto.randomUUID(),
      name: `${scenario.name} (Copy)`,
    };
    setScenarios([...scenarios, newScenario]);
  };

  // Calculate differences between scenarios
  const [scenarioResults, setScenarioResults] = useState<
    Array<{
      id: string;
      name: string;
      salary: number;
      pensionContribution: number;
      pensionAmount: number;
      taxCode: string;
      incomeTax: number;
      nationalInsurance: number;
      totalDeductions: number;
      netPay: number;
      takeHomePercent: number;
    }>
  >([]);

  // Effect to calculate tax details
  useEffect(() => {
    const calculateResults = async () => {
      try {
        // Initialize with basic data first
        const initialResults = scenarios.map((scenario) => ({
          id: scenario.id,
          name: scenario.name,
          salary: scenario.salary,
          pensionContribution: scenario.pensionContribution || 0,
          pensionAmount:
            scenario.salary * ((scenario.pensionContribution || 0) / 100),
          taxCode: scenario.taxCode,
          incomeTax: 0,
          nationalInsurance: 0,
          totalDeductions: 0,
          netPay:
            scenario.salary * (1 - (scenario.pensionContribution || 0) / 100),
          takeHomePercent:
            100 * (1 - (scenario.pensionContribution || 0) / 100),
        }));

        setScenarioResults(initialResults);

        // Then calculate tax details for each scenario
        for (const scenario of scenarios) {
          const effectiveSalary =
            scenario.salary * (1 - (scenario.pensionContribution || 0) / 100);
          const result = await calculateTaxDetails(
            effectiveSalary,
            scenario.taxCode,
            true
          );

          setScenarioResults((prev) =>
            prev.map((sr) =>
              sr.id === scenario.id
                ? {
                    ...sr,
                    incomeTax: result.annualSummary.totalIncomeTax,
                    nationalInsurance: result.annualSummary.totalNI,
                    totalDeductions:
                      result.annualSummary.totalIncomeTax +
                      result.annualSummary.totalNI,
                    netPay: result.annualSummary.netAnnual,
                    takeHomePercent:
                      (result.annualSummary.netAnnual / scenario.salary) * 100,
                  }
                : sr
            )
          );
        }
      } catch (error) {
        console.error('Error calculating scenarios:', error);
      }
    };

    calculateResults();
  }, [scenarios]);

  const baseScenario = scenarioResults[0];
  const comparisonScenarios = scenarioResults.slice(1);

  // Calculate tax efficiency - which scenario gives the best take-home pay percentage
  const mostEfficientScenario = [...scenarioResults].sort(
    (a, b) => b.takeHomePercent - a.takeHomePercent
  )[0];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>{t('scenarios.title')}</CardTitle>
              <Tooltip content="Compare different salary, tax code, and pension scenarios to see how they impact your take-home pay">
                <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
                  <InformationCircleIcon className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>
            <div className="flex gap-2">
              <div className="flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setActiveTab('table')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    activeTab === 'table'
                      ? 'bg-govuk-blue text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  } border border-gray-200 dark:border-gray-700`}
                >
                  Table View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('chart')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    activeTab === 'chart'
                      ? 'bg-govuk-blue text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  } border border-gray-200 dark:border-gray-700`}
                >
                  Chart View
                </button>
              </div>

              {scenarios.length < 4 && (
                <CustomButton
                  onClick={() => setIsModalOpen(true)}
                  icon={<PlusIcon className="h-5 w-5" />}
                >
                  {t('scenarios.addScenario')}
                </CustomButton>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {activeTab === 'table' ? (
            <div className="space-y-8">
              {/* Scenarios Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {scenarioResults.map(
                  (result) =>
                    result && (
                      <div
                        key={result.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">
                              {result.name}
                            </h3>
                            {result.id === mostEfficientScenario.id && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                                Most Efficient
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="px-4 py-4 divide-y divide-gray-200 dark:divide-gray-700">
                          <dl className="space-y-2 mb-3">
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500 dark:text-gray-400">
                                {t('calculator.annualSalary')}
                              </dt>
                              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(result.salary)}
                              </dd>
                            </div>

                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500 dark:text-gray-400">
                                {t('calculator.taxCode')}
                              </dt>
                              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.taxCode}
                              </dd>
                            </div>

                            {result.pensionContribution > 0 && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-500 dark:text-gray-400">
                                  Pension
                                </dt>
                                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                  {result.pensionContribution}% (
                                  {formatCurrency(result.pensionAmount)})
                                </dd>
                              </div>
                            )}
                          </dl>

                          <div className="pt-3 space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500 dark:text-gray-400">
                                {t('calculator.incomeTax')}
                              </dt>
                              <dd className="text-sm font-medium text-red-600 dark:text-red-400">
                                {formatCurrency(result.incomeTax)}
                              </dd>
                            </div>

                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500 dark:text-gray-400">
                                {t('calculator.nationalInsurance')}
                              </dt>
                              <dd className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                {formatCurrency(result.nationalInsurance)}
                              </dd>
                            </div>

                            <div className="flex justify-between pt-1">
                              <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Total Deductions
                              </dt>
                              <dd className="text-sm font-bold text-red-600 dark:text-red-400">
                                {formatCurrency(result.totalDeductions)}
                              </dd>
                            </div>
                          </div>

                          <div className="pt-3">
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('calculator.netPay')}
                              </dt>
                              <dd className="text-base font-bold text-govuk-blue dark:text-govuk-blue">
                                {formatCurrency(result.netPay)}
                              </dd>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                              {result.takeHomePercent.toFixed(1)}% of gross
                            </div>

                            {/* Progress bar for take-home percentage */}
                            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div
                                className="bg-govuk-blue h-2.5 rounded-full"
                                style={{ width: `${result.takeHomePercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                          <button
                            onClick={() => handleDeleteScenario(result.id)}
                            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {t('common.remove')}
                          </button>
                          <div className="space-x-3">
                            <button
                              onClick={() =>
                                handleDuplicateScenario(
                                  scenarios.find((s) => s.id === result.id)!
                                )
                              }
                              className="text-sm text-govuk-blue hover:text-govuk-blue/80 dark:text-govuk-blue dark:hover:text-govuk-blue/80"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={() =>
                                handleEditScenario(
                                  scenarios.find((s) => s.id === result.id)!
                                )
                              }
                              className="text-sm text-govuk-blue hover:text-govuk-blue/80 dark:text-govuk-blue dark:hover:text-govuk-blue/80"
                            >
                              {t('common.edit')}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>

              {/* Comparisons Section (if more than one scenario) */}
              {comparisonScenarios.length > 0 && (
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ArrowsRightLeftIcon className="h-5 w-5" />
                    Comparison with {baseScenario.name}
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Scenario
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Net Pay Difference
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Income Tax Diff
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            NI Diff
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Monthly Gain/Loss
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {comparisonScenarios.map((scenario) => {
                          const netDiff = scenario.netPay - baseScenario.netPay;
                          const taxDiff =
                            scenario.incomeTax - baseScenario.incomeTax;
                          const niDiff =
                            scenario.nationalInsurance -
                            baseScenario.nationalInsurance;
                          const monthlyDiff = netDiff / 12;

                          return (
                            <tr key={scenario.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {scenario.name}
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                  netDiff > 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : netDiff < 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {netDiff > 0 ? '+' : ''}
                                {formatCurrency(netDiff)}
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  taxDiff < 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : taxDiff > 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {taxDiff > 0 ? '+' : ''}
                                {formatCurrency(taxDiff)}
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  niDiff < 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : niDiff > 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {niDiff > 0 ? '+' : ''}
                                {formatCurrency(niDiff)}
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                  monthlyDiff > 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : monthlyDiff < 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {monthlyDiff > 0 ? '+' : ''}
                                {formatCurrency(monthlyDiff)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Analysis Section */}
                  <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Analysis & Insights
                    </h4>
                    <div className="text-sm text-blue-700 dark:text-blue-200 space-y-2">
                      {mostEfficientScenario.id !== baseScenario.id && (
                        <p>
                          <strong>{mostEfficientScenario.name}</strong> is the
                          most tax-efficient scenario, letting you keep{' '}
                          {mostEfficientScenario.takeHomePercent.toFixed(1)}% of
                          your gross income compared to{' '}
                          {baseScenario.takeHomePercent.toFixed(1)}% in your
                          base scenario.
                        </p>
                      )}

                      {comparisonScenarios.some(
                        (s) => s.pensionContribution > 0
                      ) && (
                        <p>
                          Pension contributions provide tax relief by reducing
                          your taxable income, which can be especially
                          beneficial for higher rate taxpayers.
                        </p>
                      )}

                      {comparisonScenarios.some(
                        (s) => s.taxCode !== baseScenario.taxCode
                      ) && (
                        <div>
                          <p>
                            Different tax codes can significantly impact your
                            take-home pay. Ensure your tax code is correct to
                            avoid underpaying or overpaying tax.
                          </p>
                          <p className="mt-2">
                            <button
                              onClick={() => navigate('/tax-codes-explained')}
                              className="text-govuk-blue hover:underline font-medium"
                            >
                              Learn more about tax codes →
                            </button>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ChartBarIcon className="h-6 w-6 text-govuk-blue" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Visual Comparison
                </h3>
              </div>

              <div className="space-y-8">
                {/* Gross vs Net Comparison Chart */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Gross vs Net Income
                  </h4>

                  <div className="space-y-4">
                    {scenarioResults.map((result) => (
                      <div key={result.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {result.name}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {formatCurrency(result.salary)} →{' '}
                            {formatCurrency(result.netPay)}
                          </span>
                        </div>

                        <div className="relative pt-1">
                          <div className="flex h-6 overflow-hidden text-xs rounded-md bg-gray-200 dark:bg-gray-700">
                            <div
                              style={{ width: `${result.takeHomePercent}%` }}
                              className="flex flex-col justify-center text-center text-white bg-govuk-blue dark:bg-govuk-blue overflow-hidden whitespace-nowrap transition-all duration-500"
                            >
                              <span className="px-2 text-xs">
                                {result.takeHomePercent.toFixed(1)}%
                              </span>
                            </div>
                            <div
                              style={{
                                width: `${100 - result.takeHomePercent}%`,
                              }}
                              className="flex flex-col justify-center text-center text-white bg-red-500 dark:bg-red-700 overflow-hidden whitespace-nowrap transition-all duration-500"
                            >
                              <span className="px-2 text-xs">
                                {(100 - result.takeHomePercent).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex text-xs mt-1">
                            <span className="flex-1 text-left text-govuk-blue dark:text-govuk-blue">
                              Take-home pay
                            </span>
                            <span className="flex-1 text-right text-red-500 dark:text-red-400">
                              Tax & NI
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deductions Breakdown Chart */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Deductions Breakdown
                  </h4>

                  <div className="space-y-4">
                    {scenarioResults.map((result) => (
                      <div key={result.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {result.name}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {formatCurrency(result.totalDeductions)}
                          </span>
                        </div>

                        <div className="relative pt-1">
                          <div className="flex h-6 overflow-hidden text-xs rounded-md bg-gray-200 dark:bg-gray-700">
                            {/* Income Tax portion */}
                            <div
                              style={{
                                width: `${
                                  (result.incomeTax / result.totalDeductions) *
                                  100
                                }%`,
                              }}
                              className="flex flex-col justify-center text-center text-white bg-red-500 dark:bg-red-700 overflow-hidden whitespace-nowrap transition-all duration-500"
                            >
                              <span className="px-2 text-xs">Income Tax</span>
                            </div>

                            {/* NI portion */}
                            <div
                              style={{
                                width: `${
                                  (result.nationalInsurance /
                                    result.totalDeductions) *
                                  100
                                }%`,
                              }}
                              className="flex flex-col justify-center text-center text-white bg-purple-500 dark:bg-purple-700 overflow-hidden whitespace-nowrap transition-all duration-500"
                            >
                              <span className="px-2 text-xs">NI</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs mt-1">
                          <span>
                            <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>
                            Income Tax: {formatCurrency(result.incomeTax)}
                          </span>
                          <span>
                            <span className="inline-block w-3 h-3 bg-purple-500 mr-1"></span>
                            NI: {formatCurrency(result.nationalInsurance)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Net Income Comparison */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Monthly Take-home Pay
                  </h4>

                  <div className="space-y-4">
                    {scenarioResults.map((result) => (
                      <div key={result.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {result.name}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {formatCurrency(result.netPay / 12)} / month
                          </span>
                        </div>

                        <div className="relative pt-1">
                          <div className="flex h-8 overflow-hidden text-xs rounded-md bg-gray-200 dark:bg-gray-700">
                            <div
                              style={{
                                width: `${
                                  (result.netPay /
                                    Math.max(
                                      ...scenarioResults.map((s) => s.netPay)
                                    )) *
                                  100
                                }%`,
                              }}
                              className="flex flex-col justify-center text-center text-white bg-govuk-blue dark:bg-govuk-blue overflow-hidden whitespace-nowrap transition-all duration-500"
                            >
                              <span className="px-2 text-xs">
                                {formatCurrency(result.netPay / 12)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <TaxSavingTips />

      <ScenarioModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingScenario(undefined);
        }}
        onSave={handleSaveScenario}
        initialData={editingScenario}
      />
    </div>
  );
}

export default Comparison;
