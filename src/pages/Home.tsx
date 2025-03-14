import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Link } from 'react-router-dom';
import {
  CalculatorIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ClockIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export function Home() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>UK Tax Calculator</CardTitle>
          <p className="text-gray-500 dark:text-gray-400">
            Comprehensive UK tax calculation tools to help you understand your
            taxes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">
                Welcome to the HMRC Tax Calculator
              </h2>
              <p className="text-blue-700 dark:text-blue-200 mb-4">
                This application provides a suite of tools to help you
                understand and calculate various aspects of UK taxation,
                including income tax, National Insurance contributions, company
                car benefits, and more.
              </p>
              <p className="text-blue-700 dark:text-blue-200">
                Use the navigation menu to explore the different calculators and
                tools available. Each tool is designed to help you understand
                specific aspects of the UK tax system.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
              Available Calculators
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CalcCard
                title="PAYE Calculator"
                description="Calculate your income tax and National Insurance contributions"
                icon={<CalculatorIcon className="h-6 w-6" />}
                link="/paye-calculator"
              />

              <CalcCard
                title="Car Benefit Calculator"
                description="Calculate the tax on your company car benefits"
                icon={<BriefcaseIcon className="h-6 w-6" />}
                link="/car-benefit-calculator"
              />

              <CalcCard
                title="Tax Code Explainer"
                description="Understand what your tax code means"
                icon={<DocumentTextIcon className="h-6 w-6" />}
                link="/tax-codes-explained"
              />

              <CalcCard
                title="Dates Calculator"
                description="Calculate working days, dates, and more"
                icon={<ClockIcon className="h-6 w-6" />}
                link="/dates-calculator"
              />

              <CalcCard
                title="Scenarios & Comparison"
                description="Compare different tax scenarios"
                icon={<ChartBarIcon className="h-6 w-6" />}
                link="/comparison"
              />

              <CalcCard
                title="Training Module"
                description="Learn about UK taxation with our training modules"
                icon={<AcademicCapIcon className="h-6 w-6" />}
                link="/training"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg mt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                About This Tool
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                This UK Tax Calculator is designed to provide accurate estimates
                of tax liabilities based on current HMRC rates and allowances.
                The calculations are for guidance only and should not be
                considered as tax advice.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                For official tax information and advice, please visit the{' '}
                <a
                  href="https://www.gov.uk/government/organisations/hm-revenue-customs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-govuk-blue hover:underline"
                >
                  HMRC website
                </a>{' '}
                or consult with a qualified tax professional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for calculator cards
function CalcCard({
  title,
  description,
  icon,
  link,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Link to={link} className="block group">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-govuk-blue dark:group-hover:border-govuk-blue">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-govuk-blue/10 dark:bg-govuk-blue/20 flex items-center justify-center text-govuk-blue">
            {icon}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-govuk-blue dark:group-hover:text-govuk-blue transition-colors">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
            <div className="mt-2 flex items-center text-govuk-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open calculator</span>
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
