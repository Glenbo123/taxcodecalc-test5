import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import TaxCalculator from '../components/TaxCalculator';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '../components/Tooltip';

export function PayeCalculator() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>PAYE Tax Calculator</CardTitle>
            <Tooltip content="Calculate your income tax and National Insurance contributions using the Pay As You Earn (PAYE) system.">
              <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Accurately calculate tax deductions for employment income based on
            your tax code and circumstances
          </p>
        </CardHeader>

        <CardContent>
          <TaxCalculator />
        </CardContent>
      </Card>
    </div>
  );
}

export default PayeCalculator;
