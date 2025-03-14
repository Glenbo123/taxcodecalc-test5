import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Tooltip } from '../components/Tooltip';
import { CustomButton } from '../components/CustomButton';
import {
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Input } from '../components/Input';

interface Employer {
  id: string;
  name: string;
  annualSalary: number;
  taxPaid: number;
  isCurrent: boolean;
  included: boolean;
}

interface UcaCalculationInputs {
  taxCode: string;
  currentPeriod: number;
  paymentDate: string;
  employers: Employer[];
}

interface UcaCalculationResult {
  totalIncome: number;
  totalTaxPaid: number;
  expectedTaxDue: number;
  underOverPayment: number;
  isUnderpaid: boolean;
  recommendedAction: string;
  explanation: string;
}

export function TrainingModule() {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    introduction: true,
    ucaExplanation: false,
    cumulativeVsNonCumulative: false,
    previousEmployment: false,
  });

  const [ucaInputs, setUcaInputs] = useState<UcaCalculationInputs>({
    taxCode: '1257L',
    currentPeriod: 5, // Representing August (period 5)
    paymentDate: new Date().toISOString().slice(0, 10),
    employers: [
      {
        id: '1',
        name: 'Current Employer Ltd',
        annualSalary: 36000,
        taxPaid: 3000,
        isCurrent: true,
        included: true,
      },
    ],
  });

  const [ucaResult, setUcaResult] = useState<UcaCalculationResult | null>(null);
  const [showUcaCalculator, setShowUcaCalculator] = useState(false);
  const [showEmployerForm, setShowEmployerForm] = useState(false);
  const [newEmployer, setNewEmployer] = useState<
    Omit<Employer, 'id' | 'included'>
  >({
    name: '',
    annualSalary: 0,
    taxPaid: 0,
    isCurrent: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleUcaInputChange = (
    field: keyof Omit<UcaCalculationInputs, 'employers'>,
    value: any
  ) => {
    setUcaInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addEmployer = () => {
    if (!newEmployer.name || newEmployer.annualSalary <= 0) {
      return; // Basic validation
    }

    setUcaInputs((prev) => ({
      ...prev,
      employers: [
        ...prev.employers,
        {
          id: crypto.randomUUID(),
          ...newEmployer,
          included: true,
        },
      ],
    }));

    // Reset form
    setNewEmployer({
      name: '',
      annualSalary: 0,
      taxPaid: 0,
      isCurrent: false,
    });
    setShowEmployerForm(false);
  };

  const removeEmployer = (id: string) => {
    setUcaInputs((prev) => ({
      ...prev,
      employers: prev.employers.filter((emp) => emp.id !== id),
    }));
  };

  const toggleEmployerInclusion = (id: string) => {
    setUcaInputs((prev) => ({
      ...prev,
      employers: prev.employers.map((emp) =>
        emp.id === id ? { ...emp, included: !emp.included } : emp
      ),
    }));
  };

  const calculateUcaExample = () => {
    // Get all included employers
    const includedEmployers = ucaInputs.employers.filter((emp) => emp.included);

    // Calculate total income and tax paid
    const totalIncome = includedEmployers.reduce(
      (sum, emp) => sum + emp.annualSalary,
      0
    );
    const totalTaxPaid = includedEmployers.reduce(
      (sum, emp) => sum + emp.taxPaid,
      0
    );

    // Calculate expected tax based on total income
    const monthsPassed = ucaInputs.currentPeriod;
    const personalAllowanceProportion = (12570 / 12) * monthsPassed;

    // Calculate monthly proportion of the annual income
    const monthlyProportionOfIncome = totalIncome * (monthsPassed / 12);
    const taxableIncome = Math.max(
      0,
      monthlyProportionOfIncome - personalAllowanceProportion
    );

    let expectedTax = 0;
    if (taxableIncome > 0) {
      // Basic rate tax calculation (simplified)
      const basicRateCap = ((50270 - 12570) / 12) * monthsPassed;
      const basicRateAmount = Math.min(taxableIncome, basicRateCap);
      expectedTax += basicRateAmount * 0.2;

      // Higher rate tax calculation (if applicable)
      if (taxableIncome > basicRateCap) {
        const higherRateAmount = taxableIncome - basicRateCap;
        expectedTax += higherRateAmount * 0.4;
      }
    }

    const taxDifference = expectedTax - totalTaxPaid;
    const isUnderpaid = taxDifference > 0;

    const result: UcaCalculationResult = {
      totalIncome: parseFloat(monthlyProportionOfIncome.toFixed(2)),
      totalTaxPaid: parseFloat(totalTaxPaid.toFixed(2)),
      expectedTaxDue: parseFloat(expectedTax.toFixed(2)),
      underOverPayment: parseFloat(Math.abs(taxDifference).toFixed(2)),
      isUnderpaid,
      recommendedAction:
        isUnderpaid && Math.abs(taxDifference) > 100
          ? 'Issue non-cumulative code (W1/M1)'
          : 'Issue cumulative code',
      explanation:
        isUnderpaid && Math.abs(taxDifference) > 100
          ? 'There is a significant underpayment of tax. To prevent collecting the full underpayment at once, a non-cumulative code is recommended.'
          : isUnderpaid
          ? 'There is a small underpayment of tax. A cumulative code will collect this gradually over the remaining periods.'
          : 'There is an overpayment of tax. A cumulative code will refund this overpayment over the remaining periods.',
    };

    setUcaResult(result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>PAYE Training Module</CardTitle>
            <Tooltip content="This training module helps HMRC staff practice handling tax codes, previous employment calculations, and tax code issuance.">
              <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Learn and practice tax calculations for employees with multiple
            employers and complex scenarios
          </p>
        </CardHeader>

        <CardContent>
          {/* Introduction Section */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left py-3 px-4 bg-govuk-blue/10 rounded-md"
              onClick={() => toggleSection('introduction')}
            >
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5 text-govuk-blue" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Introduction to PAYE Calculations
                </h2>
              </div>
              {expandedSections.introduction ? (
                <ChevronUpIcon className="h-5 w-5 text-govuk-blue" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-govuk-blue" />
              )}
            </button>

            {expandedSections.introduction && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Pay As You Earn (PAYE) is the system HMRC uses to collect
                  Income Tax and National Insurance from employees. This
                  training focuses on handling complex scenarios involving:
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Multiple employers in the same tax year</li>
                  <li>Previous employment earnings and tax paid</li>
                  <li>
                    Deciding between cumulative and non-cumulative tax codes
                  </li>
                  <li>Calculating the correct tax based on earnings to date</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300">
                  Working through these exercises will help you develop
                  confidence in handling common scenarios encountered when using
                  NPS (National Insurance and PAYE Service) and verifying tax
                  calculations.
                </p>
              </div>
            )}
          </div>

          {/* UCA Button Explanation */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left py-3 px-4 bg-govuk-blue/10 rounded-md"
              onClick={() => toggleSection('ucaExplanation')}
              id="ucaExplanation"
            >
              <div className="flex items-center gap-2">
                <DocumentCheckIcon className="h-5 w-5 text-govuk-blue" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Understanding the UCA Button
                </h2>
              </div>
              {expandedSections.ucaExplanation ? (
                <ChevronUpIcon className="h-5 w-5 text-govuk-blue" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-govuk-blue" />
              )}
            </button>

            {expandedSections.ucaExplanation && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The UCA (User Calculation Aid) button in NPS is a critical
                  tool for HMRC staff to verify tax calculations and determine
                  the appropriate tax code for taxpayers. Here's how it works:
                </p>

                <div className="mb-4">
                  <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
                    UCA Button Functionality:
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>
                      When clicked, it shows all employments (primary and
                      previous)
                    </li>
                    <li>It performs a tax table check against total income</li>
                    <li>
                      It compares tax paid to date with what should have been
                      paid by the current period
                    </li>
                    <li>
                      It helps determine if tax is underpaid, overpaid, or
                      correct
                    </li>
                    <li>
                      Based on the comparison, it assists in deciding whether to
                      issue a cumulative or non-cumulative tax code
                    </li>
                  </ol>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded mb-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Important:</strong> When using the UCA calculation
                    to handle previous employments, you must uncheck the
                    "current employer" checkbox if you're adding those values to
                    the "previous pay and tax" box on the tax code. Otherwise,
                    you would double-count the primary employment, which could
                    lead to incorrect tax calculations.
                  </p>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Using UCA correctly is essential for accurate tax code
                  issuance and ensuring taxpayers pay the correct amount of tax
                  throughout the year, avoiding large underpayments or
                  overpayments at year-end.
                </p>

                <div className="flex justify-end">
                  <CustomButton
                    onClick={() => setShowUcaCalculator(!showUcaCalculator)}
                  >
                    {showUcaCalculator
                      ? 'Hide UCA Simulator'
                      : 'Try UCA Simulator'}
                  </CustomButton>
                </div>
              </div>
            )}

            {/* UCA Simulator Section */}
            {expandedSections.ucaExplanation && showUcaCalculator && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-900">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-4">
                  UCA Multiple Employer Calculator
                </h3>

                <div className="mb-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-blue-200 dark:border-blue-800 mb-4">
                    <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
                      Employer List
                    </h4>

                    {ucaInputs.employers.map((employer) => (
                      <div
                        key={employer.id}
                        className="flex items-center justify-between p-3 mb-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={employer.included}
                            onChange={() =>
                              toggleEmployerInclusion(employer.id)
                            }
                            className="h-4 w-4 text-govuk-blue focus:ring-govuk-blue border-gray-300 rounded"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {employer.name}{' '}
                              {employer.isCurrent && (
                                <span className="text-xs text-blue-600 dark:text-blue-400">
                                  (Current)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Salary: £{employer.annualSalary.toLocaleString()}{' '}
                              | Tax Paid: £{employer.taxPaid.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeEmployer(employer.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                          aria-label="Remove employer"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {ucaInputs.employers.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No employers added yet.
                      </p>
                    )}

                    {!showEmployerForm ? (
                      <button
                        onClick={() => setShowEmployerForm(true)}
                        className="mt-2 flex items-center text-sm text-govuk-blue hover:text-govuk-blue/80 dark:text-govuk-blue dark:hover:text-govuk-blue/80"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Employer
                      </button>
                    ) : (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Add New Employer
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Employer Name
                            </label>
                            <Input
                              type="text"
                              value={newEmployer.name}
                              onChange={(e) =>
                                setNewEmployer({
                                  ...newEmployer,
                                  name: e.target.value,
                                })
                              }
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Annual Salary
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                  £
                                </span>
                              </div>
                              <Input
                                type="number"
                                value={newEmployer.annualSalary}
                                onChange={(e) =>
                                  setNewEmployer({
                                    ...newEmployer,
                                    annualSalary: Number(e.target.value) || 0,
                                  })
                                }
                                className="pl-7 text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Tax Paid To Date
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                  £
                                </span>
                              </div>
                              <Input
                                type="number"
                                value={newEmployer.taxPaid}
                                onChange={(e) =>
                                  setNewEmployer({
                                    ...newEmployer,
                                    taxPaid: Number(e.target.value) || 0,
                                  })
                                }
                                className="pl-7 text-sm"
                              />
                            </div>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newEmployer.isCurrent}
                              onChange={(e) =>
                                setNewEmployer({
                                  ...newEmployer,
                                  isCurrent: e.target.checked,
                                })
                              }
                              className="h-4 w-4 text-govuk-blue focus:ring-govuk-blue border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-xs text-gray-700 dark:text-gray-300">
                              Current Employer
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-3">
                          <CustomButton
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowEmployerForm(false)}
                          >
                            Cancel
                          </CustomButton>
                          <CustomButton size="sm" onClick={addEmployer}>
                            Add Employer
                          </CustomButton>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                    <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
                      Tax Code & Period
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tax Code
                        </label>
                        <Input
                          type="text"
                          value={ucaInputs.taxCode}
                          onChange={(e) =>
                            handleUcaInputChange(
                              'taxCode',
                              e.target.value.toUpperCase()
                            )
                          }
                          className="uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Period (1-12)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={ucaInputs.currentPeriod}
                          onChange={(e) =>
                            handleUcaInputChange(
                              'currentPeriod',
                              parseInt(e.target.value) || 1
                            )
                          }
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Period 1 = April, Period 12 = March
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Payment Date
                        </label>
                        <Input
                          type="date"
                          value={ucaInputs.paymentDate}
                          onChange={(e) =>
                            handleUcaInputChange('paymentDate', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <CustomButton onClick={calculateUcaExample}>
                    Calculate UCA Result
                  </CustomButton>
                </div>

                {/* UCA Result Display */}
                {ucaResult && (
                  <div className="mt-6 border-t border-blue-200 dark:border-blue-800 pt-4">
                    <h4 className="text-base font-medium text-blue-800 dark:text-blue-300 mb-3">
                      UCA Calculation Result
                    </h4>

                    <div className="rounded-md border border-blue-200 dark:border-blue-800 overflow-hidden">
                      <div className="bg-blue-100 dark:bg-blue-900/40 px-4 py-2 border-b border-blue-200 dark:border-blue-800">
                        <h5 className="font-medium text-blue-800 dark:text-blue-300">
                          Tax Summary
                        </h5>
                      </div>

                      <div className="p-4 space-y-3 bg-white dark:bg-gray-800">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total Income to Date:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            £{ucaResult.totalIncome.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total Tax Paid to Date:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            £{ucaResult.totalTaxPaid.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Expected Tax Due:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            £{ucaResult.expectedTaxDue.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between pt-2 border-t border-blue-100 dark:border-blue-900/40">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {ucaResult.isUnderpaid
                              ? 'Underpayment:'
                              : 'Overpayment:'}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              ucaResult.isUnderpaid
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-green-600 dark:text-green-400'
                            }`}
                          >
                            £{ucaResult.underOverPayment.toLocaleString()}
                          </span>
                        </div>

                        <div className="pt-3 pb-1">
                          <div className="flex items-start gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Recommended Action:
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                {ucaResult.recommendedAction}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {ucaResult.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-900">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Training Note:</strong> When adding previous
                        employment details to the P2 form or P6/P9 form, you
                        should uncheck the current employer. This is because the
                        current employer already has their own information -
                        they need only the details from previous employments.
                        Including the current employer's information would lead
                        to double-counting and incorrect tax calculations.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cumulative vs Non-Cumulative */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left py-3 px-4 bg-govuk-blue/10 rounded-md"
              onClick={() => toggleSection('cumulativeVsNonCumulative')}
            >
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5 text-govuk-blue" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Cumulative vs Non-Cumulative Tax Codes
                </h2>
              </div>
              {expandedSections.cumulativeVsNonCumulative ? (
                <ChevronUpIcon className="h-5 w-5 text-govuk-blue" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-govuk-blue" />
              )}
            </button>

            {expandedSections.cumulativeVsNonCumulative && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Understanding when to use cumulative versus non-cumulative tax
                  codes is crucial for correct tax collection:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                    <h3 className="text-base font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Cumulative Tax Codes
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-200">
                      <li>
                        Consider all earnings since the start of the tax year
                      </li>
                      <li>Use when previous tax paid is correct or overpaid</li>
                      <li>
                        Automatically adjusts for under/overpayments in future
                        periods
                      </li>
                      <li>Example: 1257L (without W1/M1 suffix)</li>
                      <li>
                        Preferred in most cases for accurate tax collection
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                    <h3 className="text-base font-medium text-purple-800 dark:text-purple-300 mb-2">
                      Non-Cumulative Tax Codes
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-purple-700 dark:text-purple-200">
                      <li>Treats each pay period independently</li>
                      <li>Use when there's significant underpayment of tax</li>
                      <li>
                        Prevents collecting large underpayments all at once
                      </li>
                      <li>Example: 1257L W1/M1 (Week 1/Month 1)</li>
                      <li>
                        Helpful to manage tax collection for taxpayer cashflow
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-md">
                  <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Decision Rule:
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>Tax Overpaid:</strong> Use cumulative code to
                      refund the overpayment
                    </li>
                    <li>
                      <strong>Tax Underpaid:</strong> Consider W1/M1 code to
                      prevent collecting the full underpayment at once
                    </li>
                    <li>
                      <strong>Large Underpayment:</strong> W1/M1 ensures tax is
                      equally collected and prevents the underpayment being
                      collected in full (or up to 50%)
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Previous Employment Section */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left py-3 px-4 bg-govuk-blue/10 rounded-md"
              onClick={() => toggleSection('previousEmployment')}
            >
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-govuk-blue" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Handling Previous Employment Information
                </h2>
              </div>
              {expandedSections.previousEmployment ? (
                <ChevronUpIcon className="h-5 w-5 text-govuk-blue" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-govuk-blue" />
              )}
            </button>

            {expandedSections.previousEmployment && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  When a taxpayer starts a new job, it's essential to correctly
                  process their previous employment information:
                </p>

                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                    <h3 className="text-base font-medium text-green-800 dark:text-green-300 mb-2">
                      P45 Information
                    </h3>
                    <p className="text-green-700 dark:text-green-200 mb-2">
                      The P45 provides critical information for tax
                      calculations:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-200">
                      <li>Total pay to date for the current tax year</li>
                      <li>Total tax paid to date for the current tax year</li>
                      <li>Previous tax code</li>
                      <li>National Insurance number</li>
                      <li>Student loan deduction indicator</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                    <h3 className="text-base font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                      Key Considerations
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-yellow-700 dark:text-yellow-200">
                      <li>
                        Always verify the tax year of the previous employment
                        information
                      </li>
                      <li>
                        If the taxpayer has multiple previous employments in the
                        tax year, combine all pay and tax details
                      </li>
                      <li>
                        If the P45 shows a Week 1/Month 1 tax code, consider
                        whether to continue with non-cumulative basis
                      </li>
                      <li>
                        Use the UCA function to check if the correct tax has
                        been paid to date
                      </li>
                      <li>
                        Check for any benefits or deductions from previous
                        employment that might affect the tax code
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                    <h3 className="text-base font-medium text-red-800 dark:text-red-300 mb-2">
                      Common Errors
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-200">
                      <li>
                        Double counting income by including previous employment
                        in both P45 box and UCA calculation
                      </li>
                      <li>
                        Applying cumulative tax code when significant
                        underpayment exists
                      </li>
                      <li>
                        Failing to check if previous tax code was on emergency
                        basis
                      </li>
                      <li>
                        Not accounting for mid-month starters when calculating
                        period-specific allowances
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Training Exercise */}
          <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Practice Scenarios
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Apply your knowledge of tax codes, UCA calculations, and previous
              employment handling with these interactive scenarios:
            </p>

            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-govuk-blue/10 px-4 py-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Scenario 1: Multiple Employers
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    A taxpayer has started a new job in August with an annual
                    salary of £36,000. They have a previous employer where they
                    earned £15,000 and paid £2,400 in tax. Their tax code on the
                    P45 is 1257L.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Your task:</strong> Use the UCA Simulator to
                    determine whether to issue a cumulative or non-cumulative
                    code, and identify which employer's information to include
                    when adding previous pay and tax to the new employer's
                    record.
                  </p>
                  <div className="flex justify-end">
                    <CustomButton
                      onClick={() => {
                        setUcaInputs({
                          taxCode: '1257L',
                          currentPeriod: 5, // August
                          paymentDate: new Date().toISOString().slice(0, 10),
                          employers: [
                            {
                              id: '1',
                              name: 'Current Employer Ltd',
                              annualSalary: 36000,
                              taxPaid: 3000,
                              isCurrent: true,
                              included: true,
                            },
                            {
                              id: '2',
                              name: 'Previous Employer Ltd',
                              annualSalary: 15000,
                              taxPaid: 2400,
                              isCurrent: false,
                              included: true,
                            },
                          ],
                        });
                        setShowUcaCalculator(true);
                        toggleSection('ucaExplanation');

                        // Scroll to the UCA section
                        const element =
                          document.getElementById('ucaExplanation');
                        if (element) {
                          const yOffset = -20;
                          const y =
                            element.getBoundingClientRect().top +
                            window.pageYOffset +
                            yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                    >
                      Try This Scenario
                    </CustomButton>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-govuk-blue/10 px-4 py-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Scenario 2: Three Employers
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    A taxpayer has three employers: a current employer paying
                    £25,000 per year, and two previous employers in this tax
                    year. One previous employer paid £12,000 with £1,200 tax,
                    and another paid £5,000 with £500 tax.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Your task:</strong> Determine which employers'
                    information should be included in the UCA calculation, and
                    which should be checked when adding previous pay and tax to
                    a P2 notice.
                  </p>
                  <div className="flex justify-end">
                    <CustomButton
                      onClick={() => {
                        setUcaInputs({
                          taxCode: '1257L',
                          currentPeriod: 7, // October
                          paymentDate: new Date().toISOString().slice(0, 10),
                          employers: [
                            {
                              id: '1',
                              name: 'Current Main Employer',
                              annualSalary: 25000,
                              taxPaid: 2500,
                              isCurrent: true,
                              included: true,
                            },
                            {
                              id: '2',
                              name: 'Previous Employer 1',
                              annualSalary: 12000,
                              taxPaid: 1200,
                              isCurrent: false,
                              included: true,
                            },
                            {
                              id: '3',
                              name: 'Previous Employer 2',
                              annualSalary: 5000,
                              taxPaid: 500,
                              isCurrent: false,
                              included: true,
                            },
                          ],
                        });
                        setShowUcaCalculator(true);
                        toggleSection('ucaExplanation');

                        // Scroll to the UCA section
                        const element =
                          document.getElementById('ucaExplanation');
                        if (element) {
                          const yOffset = -20;
                          const y =
                            element.getBoundingClientRect().top +
                            window.pageYOffset +
                            yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                    >
                      Try This Scenario
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TrainingModule;
