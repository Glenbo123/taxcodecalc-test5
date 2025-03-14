import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Tooltip } from '../components/Tooltip';
import {
  DocumentTextIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

export function TaxCodesExplained() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'basics'
  );

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const taxCodeSections = [
    {
      id: 'basics',
      title: 'Understanding Tax Codes',
      content: (
        <>
          <p className="mb-3">
            A tax code is used by your employer or pension provider to calculate
            the amount of Income Tax to deduct from your pay or pension.
          </p>
          <p className="mb-3">Most UK tax codes consist of:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li>Numbers - indicating your tax-free Personal Allowance</li>
            <li>
              Letters - indicating your situation and how it affects your
              Personal Allowance
            </li>
          </ul>
          <p>
            For example, in the tax code <strong>1257L</strong>, "1257" means
            you can earn £12,570 before paying tax, and "L" indicates you're
            entitled to the standard tax-free Personal Allowance.
          </p>
        </>
      ),
    },
    {
      id: 'letters',
      title: 'Tax Code Letters Explained',
      content: (
        <div className="space-y-4">
          <p>Each letter in a tax code has a specific meaning:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                L
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                You're entitled to the standard tax-free Personal Allowance
                (£12,570 for 2024/25)
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                M
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Marriage Allowance: you've received a transfer of 10% of your
                partner's Personal Allowance
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                N
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Marriage Allowance: you've transferred 10% of your Personal
                Allowance to your partner
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                T
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Your tax code includes other calculations to work out your
                Personal Allowance
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                0T
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Your Personal Allowance has been used up, or you've started a
                new job and don't have a P45
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                BR
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                All your income from this job or pension is taxed at the basic
                rate (20%)
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                D0
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                All your income from this job or pension is taxed at the higher
                rate (40%)
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                D1
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                All your income from this job or pension is taxed at the
                additional rate (45%)
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                K
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                You have income that isn't being taxed another way and it's
                worth more than your tax-free allowance
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                NT
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                You're not paying any tax on this income
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                S
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Your income or pension is taxed using rates in Scotland
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                C
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Your income or pension is taxed using rates in Wales
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'numbers',
      title: 'Understanding the Numbers',
      content: (
        <>
          <p className="mb-3">
            The numbers in your tax code tell you how much tax-free income you
            get in that tax year.
          </p>
          <p className="mb-3">To understand what the numbers mean:</p>
          <ol className="list-decimal pl-5 mb-3 space-y-1">
            <li>Multiply the number by 10</li>
            <li>
              This gives you the total amount of income you can earn before
              paying tax
            </li>
          </ol>
          <p className="mb-3">For example:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li>
              <strong>1257</strong> means you can earn £12,570 before paying tax
            </li>
            <li>
              <strong>1000</strong> means you can earn £10,000 before paying tax
            </li>
          </ul>
          <p>
            If your tax code has a 'K' at the beginning (e.g., K500), this means
            you have income that isn't being taxed another way (such as state
            benefits or company benefits) and it's worth more than your tax-free
            allowance.
          </p>
        </>
      ),
    },
    {
      id: 'emergency',
      title: 'Emergency Tax Codes',
      content: (
        <>
          <p className="mb-3">You may be put on an emergency tax code if:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li>You're starting your first job</li>
            <li>
              You're starting a new job and don't have a P45 from your previous
              employer
            </li>
            <li>You're returning to work after receiving certain benefits</li>
            <li>You're taking a second job or a pension while working</li>
          </ul>
          <p className="mb-3">The most common emergency tax codes are:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li>
              <strong>1257L W1</strong>
            </li>
            <li>
              <strong>1257L M1</strong>
            </li>
            <li>
              <strong>1257L X</strong>
            </li>
          </ul>
          <p>
            The 'W1' (week 1) or 'M1' (month 1) at the end means your tax is
            calculated based on what you're paid in the current pay period, not
            the whole year. This often results in you paying too much tax
            initially.
          </p>
        </>
      ),
    },
    {
      id: 'check',
      title: 'How to Check Your Tax Code',
      content: (
        <>
          <p className="mb-3">You can find your tax code:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li>On your payslip</li>
            <li>On your P45</li>
            <li>On your P60</li>
            <li>On letters about your tax code from HMRC</li>
            <li>In your Personal Tax Account online at gov.uk</li>
          </ul>
          <p className="mb-3">
            If you think your tax code might be wrong, contact HMRC:
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Income Tax Helpline:</strong> 0300 200 3300
              <br />
              <strong>Textphone:</strong> 0300 200 3319
              <br />
              <strong>Outside UK:</strong> +44 135 535 9022
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'adjustment',
      title: 'Common Tax Code Adjustments',
      content: (
        <>
          <p className="mb-3">
            Various factors can affect your tax code and reduce your Personal
            Allowance:
          </p>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                Company Benefits
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Benefits like company cars, private medical insurance, or
                interest-free loans can reduce your tax-free allowance.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                Untaxed Income
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Income that hasn't been taxed, such as from renting out property
                or savings interest, can affect your code.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                Taxable State Benefits
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Some state benefits are taxable and can affect your tax code,
                like State Pension.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                High Income
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                If you earn over £100,000, your Personal Allowance is reduced by
                £1 for every £2 over the threshold.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                Tax Underpaid in Previous Years
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                If you didn't pay enough tax in a previous year, HMRC might
                collect it through your tax code.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Tax Codes Explained</CardTitle>
            <Tooltip content="Learn about how tax codes work and what the letters and numbers mean">
              <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
                  What is a Tax Code?
                </h3>
                <p className="text-blue-700 dark:text-blue-200">
                  Your tax code is used by your employer or pension provider to
                  calculate how much Income Tax to take from your pay or
                  pension. It's made up of numbers and letters, like 1257L,
                  which tell them how much tax-free income you get and if your
                  tax situation affects your Personal Allowance.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {taxCodeSections.map((section) => (
              <div key={section.id} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {section.id === 'letters' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-govuk-blue">
                        L
                      </span>
                    )}
                    {section.id === 'numbers' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-govuk-blue">
                        1257
                      </span>
                    )}
                    {section.id === 'emergency' && (
                      <ArrowPathIcon className="h-5 w-5 text-yellow-500" />
                    )}
                    {section.id === 'check' && (
                      <QuestionMarkCircleIcon className="h-5 w-5 text-purple-500" />
                    )}
                    {section.id === 'adjustment' && (
                      <DocumentTextIcon className="h-5 w-5 text-red-500" />
                    )}
                    {section.title}
                  </h3>
                  {expandedSection === section.id ? (
                    <ChevronUpIcon className="h-5 w-5 text-govuk-blue" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-govuk-blue" />
                  )}
                </button>

                {expandedSection === section.id && (
                  <div className="mt-4 text-gray-600 dark:text-gray-300">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TaxCodesExplained;
