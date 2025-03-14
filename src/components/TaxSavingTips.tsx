import { Card, CardHeader, CardTitle, CardContent } from './Card';
import {
  AcademicCapIcon,
  BookOpenIcon,
  BanknotesIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';

export function TaxSavingTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Saving Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AcademicCapIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-medium text-blue-800 dark:text-blue-300">
                Pension Contributions
              </h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Contributing to a pension can reduce your taxable income and help
              you save for retirement. Contributions receive tax relief at your
              highest rate of tax.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BanknotesIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-base font-medium text-green-800 dark:text-green-300">
                ISA Investments
              </h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-200">
              Individual Savings Accounts (ISAs) allow you to save or invest up
              to £20,000 per tax year without paying any tax on the interest,
              dividends, or capital gains.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <GiftIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-medium text-purple-800 dark:text-purple-300">
                Charitable Donations
              </h3>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-200">
              Gift Aid donations allow charities to claim an extra 25p for every
              £1 you give. Higher and additional rate taxpayers can claim
              further tax relief on their donations.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpenIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-medium text-amber-800 dark:text-amber-300">
                Marriage Allowance
              </h3>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-200">
              If you're married or in a civil partnership, you may be able to
              transfer £1,260 of your Personal Allowance to your spouse,
              potentially reducing their tax bill by up to £252.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TaxSavingTips;
