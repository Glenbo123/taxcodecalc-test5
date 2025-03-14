import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Tooltip } from '../components/Tooltip';
import { CustomButton } from '../components/CustomButton';
import { PreviousEmploymentCalculator } from '../components/PreviousEmploymentCalculator';
import {
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

export function PayeTraining() {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    introduction: true,
    ucaExplanation: false,
    cumulativeVsNonCumulative: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
            >
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5 text-govuk-blue" />
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
                  In NPS, the UCA (User Calculation Aid) button provides a way
                  to check if the correct amount of tax has been paid based on
                  all employments in the tax year. Here's how it works:
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
                      This determines whether to issue a cumulative or
                      non-cumulative tax code
                    </li>
                  </ol>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Important:</strong> When using the UCA calculation
                    to handle previous employments, you must uncheck the
                    "primary" checkbox if you're adding those values to the
                    "previous pay and tax" box on the tax code. Otherwise, you
                    would double-count the primary employment.
                  </p>
                </div>
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

          {/* Training Exercise */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Practice Exercise: Multiple Employer Tax Calculation
            </h2>

            <PreviousEmploymentCalculator />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default { PayeTraining };
