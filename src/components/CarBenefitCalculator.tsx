import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Input } from './Input';
import { CustomButton } from '../components/CustomButton';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';
import { formatCurrency } from '../utils/formatters';

export function CarBenefitCalculator() {
  const { t } = useTranslation();
  const [listPrice, setListPrice] = useState(30000);
  const [co2Emissions, setCo2Emissions] = useState(120);
  const [fuelType, setFuelType] = useState<
    'petrol' | 'diesel' | 'electric' | 'hybrid'
  >('petrol');
  const [rde2Compliant, setRde2Compliant] = useState(true);
  const [electricRange, setElectricRange] = useState(0);
  const [privateFuelProvided, setPrivateFuelProvided] = useState(false);
  const [taxRate, setTaxRate] = useState(20);

  const calculateBenefitValue = useCallback(() => {
    let percentage = 0;

    if (fuelType === 'electric') {
      percentage = 2;
    } else if (fuelType === 'hybrid') {
      if (electricRange > 130) percentage = 2;
      else if (electricRange > 70) percentage = 5;
      else if (electricRange > 40) percentage = 8;
      else if (electricRange > 30) percentage = 12;
      else percentage = 14;
    } else {
      percentage = Math.min(
        37,
        Math.max(15, Math.floor(co2Emissions / 5) * 1 + 15)
      );
      if (fuelType === 'diesel' && !rde2Compliant) percentage += 4;
    }

    const bikValue = (listPrice * percentage) / 100;
    const fuelBenefit = privateFuelProvided ? 27600 : 0;
    const totalBenefit = bikValue + fuelBenefit;
    const taxPayable = (totalBenefit * taxRate) / 100;

    return {
      bikValue,
      fuelBenefit,
      totalBenefit,
      taxPayable,
      percentage,
      monthlyTaxCost: taxPayable / 12,
    };
  }, [
    listPrice,
    co2Emissions,
    fuelType,
    rde2Compliant,
    electricRange,
    privateFuelProvided,
    taxRate,
  ]);

  const result = calculateBenefitValue();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Car Benefit Calculator</CardTitle>
          <Tooltip content="Calculate the tax on your company car benefits">
            <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                List Price
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                    £
                  </span>
                </div>
                <Input
                  type="number"
                  value={listPrice}
                  onChange={(e) =>
                    setListPrice(parseFloat(e.target.value) || 0)
                  }
                  className="pl-7"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CO2 Emissions (g/km)
              </label>
              <Input
                type="number"
                value={co2Emissions}
                onChange={(e) =>
                  setCo2Emissions(parseFloat(e.target.value) || 0)
                }
                min={0}
                max={999}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-govuk-blue focus:border-govuk-blue sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>

            {fuelType === 'diesel' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rde2Compliant}
                  onChange={(e) => setRde2Compliant(e.target.checked)}
                  className="h-4 w-4 text-govuk-blue focus:ring-govuk-blue border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  RDE2 Compliant
                </label>
              </div>
            )}

            {fuelType === 'hybrid' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Electric Range (miles)
                </label>
                <Input
                  type="number"
                  value={electricRange}
                  onChange={(e) =>
                    setElectricRange(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  max={999}
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={privateFuelProvided}
                onChange={(e) => setPrivateFuelProvided(e.target.checked)}
                className="h-4 w-4 text-govuk-blue focus:ring-govuk-blue border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Private Fuel Provided
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tax Rate (%)
              </label>
              <Input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                min={0}
                max={100}
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Benefit Calculation
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Appropriate Percentage
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {result.percentage}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Car Benefit Value
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(result.bikValue)}
                </span>
              </div>

              {privateFuelProvided && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Fuel Benefit
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(result.fuelBenefit)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Benefit
                </span>
                <span className="text-base font-bold text-govuk-blue dark:text-govuk-blue">
                  {formatCurrency(result.totalBenefit)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Annual Tax Cost
                </span>
                <span className="text-base font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(result.taxPayable)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Tax Cost
                </span>
                <span className="text-base font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(result.monthlyTaxCost)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
