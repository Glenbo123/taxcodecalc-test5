import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { CustomButton } from '../components/CustomButton';
import {
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BanknotesIcon,
  HomeIcon,
  BriefcaseIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';

export function TaxGuides() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['introduction'])
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Understanding UK Income Tax',
      icon: AcademicCapIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Income Tax is a tax you pay on your income. Not all income is
            taxable, and you're only taxed on income above your Personal
            Allowance.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
              Key Points
            </h3>
            <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-200">
              <li>Personal Allowance is £12,570 (2024/25)</li>
              <li>Basic rate (20%) from £12,571 to £50,270</li>
              <li>Higher rate (40%) from £50,271 to £125,140</li>
              <li>Additional rate (45%) over £125,140</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'salary-sacrifice',
      title: 'Salary Sacrifice and Benefits',
      icon: BanknotesIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Salary sacrifice is an arrangement where you give up part of your
            salary in return for benefits, potentially reducing your tax and
            National Insurance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
                Common Benefits
              </h3>
              <ul className="list-disc list-inside space-y-2 text-green-700 dark:text-green-200">
                <li>Pension contributions</li>
                <li>Childcare vouchers</li>
                <li>Cycle to work scheme</li>
                <li>Electric car schemes</li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">
                Tax Advantages
              </h3>
              <ul className="list-disc list-inside space-y-2 text-purple-700 dark:text-purple-200">
                <li>Lower Income Tax</li>
                <li>Reduced National Insurance</li>
                <li>Cost-effective benefits</li>
                <li>Higher take-home pay</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'property-income',
      title: 'Property Income and Taxes',
      icon: HomeIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            If you receive rental income from property, you need to declare it
            and may need to pay tax. Understanding allowable expenses can help
            reduce your tax bill.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-orange-800 dark:text-orange-300 mb-2">
                Allowable Expenses
              </h3>
              <ul className="list-disc list-inside space-y-2 text-orange-700 dark:text-orange-200">
                <li>Mortgage interest (basic rate relief)</li>
                <li>Repairs and maintenance</li>
                <li>Insurance and utilities</li>
                <li>Professional fees</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
                Non-Allowable Expenses
              </h3>
              <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-200">
                <li>Property improvements</li>
                <li>Personal expenses</li>
                <li>Capital repayments</li>
                <li>Private use portion</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'employment-benefits',
      title: 'Employment Benefits and BIK',
      icon: BriefcaseIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Benefits in Kind (BIK) are non-cash benefits provided by employers.
            These benefits are taxable and should be reported on your P11D form.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                Common Benefits
              </h3>
              <ul className="list-disc list-inside space-y-2 text-indigo-700 dark:text-indigo-200">
                <li>Company cars</li>
                <li>Private medical insurance</li>
                <li>Living accommodation</li>
                <li>Interest-free loans</li>
              </ul>
            </div>

            <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-pink-800 dark:text-pink-300 mb-2">
                Tax Implications
              </h3>
              <ul className="list-disc list-inside space-y-2 text-pink-700 dark:text-pink-200">
                <li>Added to taxable income</li>
                <li>May affect tax code</li>
                <li>NI contributions may apply</li>
                <li>Annual reporting required</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tax-efficient-giving',
      title: 'Tax-Efficient Giving',
      icon: GiftIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Making charitable donations through Gift Aid allows charities to
            claim additional money from HMRC, and higher-rate taxpayers can
            claim additional relief.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-teal-800 dark:text-teal-300 mb-2">
                Gift Aid Benefits
              </h3>
              <ul className="list-disc list-inside space-y-2 text-teal-700 dark:text-teal-200">
                <li>Charity claims 25p per £1 donated</li>
                <li>Higher rate relief available</li>
                <li>Reduces your tax bill</li>
                <li>Supports charitable causes</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">
                How to Claim
              </h3>
              <ul className="list-disc list-inside space-y-2 text-amber-700 dark:text-amber-200">
                <li>Through Self Assessment</li>
                <li>Contact HMRC directly</li>
                <li>Keep donation records</li>
                <li>Claim within time limits</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tax Learning Center</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comprehensive guides to help you understand UK taxation
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-6 w-6 text-govuk-blue" />
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.has(section.id) && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
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

export default TaxGuides;
