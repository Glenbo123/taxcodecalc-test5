import { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '../components/Tooltip';

interface BenefitEligibility {
  name: string;
  eligible: boolean;
  description: string;
  amount?: number;
  frequency?: string;
}

export function Benefits() {
  const [income, setIncome] = useState(50000);
  const [householdSize, setHouseholdSize] = useState(1);
  const [hasChildren, setHasChildren] = useState(false);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isCaringForSomeone, setIsCaringForSomeone] = useState(false);
  const [housingCosts, setHousingCosts] = useState(0);

  const checkEligibility = (): BenefitEligibility[] => {
    const benefits: BenefitEligibility[] = [];

    // Universal Credit
    const ucEligible = income < 40000 && housingCosts > 0;
    benefits.push({
      name: 'Universal Credit',
      eligible: ucEligible,
      description: 'A payment to help with living costs',
      amount: ucEligible ? calculateUniversalCredit() : 0,
      frequency: 'monthly',
    });

    // Child Benefit
    if (hasChildren && numberOfChildren > 0) {
      const cbEligible = income < 50000;
      benefits.push({
        name: 'Child Benefit',
        eligible: cbEligible,
        description: 'A payment to help with the cost of raising a child',
        amount: cbEligible ? calculateChildBenefit() : 0,
        frequency: 'weekly',
      });
    }

    // Carer's Allowance
    if (isCaringForSomeone) {
      benefits.push({
        name: "Carer's Allowance",
        eligible: income < 30000,
        description:
          'A payment for people who care for someone for at least 35 hours a week',
        amount: 76.75,
        frequency: 'weekly',
      });
    }

    // Personal Independence Payment
    if (isDisabled) {
      benefits.push({
        name: 'Personal Independence Payment',
        eligible: true,
        description:
          'A payment to help with extra living costs if you have a long-term health condition or disability',
        amount: 172.75,
        frequency: 'weekly',
      });
    }

    return benefits;
  };

  const calculateUniversalCredit = (): number => {
    let amount = 335.91; // Standard allowance for single person
    if (householdSize > 1) amount = 525.72; // Couple rate
    if (hasChildren) amount += numberOfChildren * 290.0; // Child element
    if (housingCosts > 0) amount += Math.min(housingCosts, 1000); // Housing costs element
    return amount;
  };

  const calculateChildBenefit = (): number => {
    if (numberOfChildren === 0) return 0;
    let amount = 24.0; // First child
    amount += (numberOfChildren - 1) * 15.9; // Additional children
    return amount;
  };

  const benefits = checkEligibility();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Benefits Calculator
          </h1>
          <Tooltip content="Calculate your potential eligibility for various UK benefits based on your circumstances">
            <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Annual Household Income
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                    £
                  </span>
                </div>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                  className="focus:ring-govuk-blue focus:border-govuk-blue block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Monthly Housing Costs
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                    £
                  </span>
                </div>
                <input
                  type="number"
                  value={housingCosts}
                  onChange={(e) =>
                    setHousingCosts(parseFloat(e.target.value) || 0)
                  }
                  className="focus:ring-govuk-blue focus:border-govuk-blue block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Household Size
              </label>
              <select
                value={householdSize}
                onChange={(e) => setHouseholdSize(parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-govuk-blue focus:border-govuk-blue sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value={1}>Single</option>
                <option value={2}>Couple</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasChildren}
                  onChange={(e) => {
                    setHasChildren(e.target.checked);
                    if (!e.target.checked) setNumberOfChildren(0);
                  }}
                  className="h-4 w-4 text-govuk-blue focus:ring-govuk-blue border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Do you have children?
                </label>
              </div>

              {hasChildren && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={numberOfChildren}
                    onChange={(e) =>
                      setNumberOfChildren(parseInt(e.target.value) || 0)
                    }
                    className="mt-1 focus:ring-govuk-blue focus:border-govuk-blue block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isDisabled}
                  onChange={(e) => setIsDisabled(e.target.checked)}
                  className="h-4 w-4 text-govuk-blue focus:ring-govuk-blue border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Do you have a disability?
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isCaringForSomeone}
                  onChange={(e) => setIsCaringForSomeone(e.target.checked)}
                  className="h-4 w-4 text-govuk-blue focus:ring-govuk-blue border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Are you caring for someone?
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Potential Benefits
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    benefit.eligible
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900'
                      : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {benefit.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {benefit.description}
                  </p>
                  {benefit.eligible && benefit.amount && (
                    <p className="text-sm font-medium text-green-700 dark:text-green-400 mt-2">
                      Estimated amount: £{benefit.amount.toFixed(2)}{' '}
                      {benefit.frequency}
                    </p>
                  )}
                  {!benefit.eligible && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Not eligible based on current circumstances
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
