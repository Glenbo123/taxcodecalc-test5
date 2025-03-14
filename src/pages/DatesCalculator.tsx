import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Input } from '../components/Input';
import { CustomButton } from '../components/CustomButton';
import { Tooltip } from '../components/Tooltip';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export function DatesCalculator() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [excludeWeekends, setExcludeWeekends] = useState<boolean>(true);
  const [excludeHolidays, setExcludeHolidays] = useState<boolean>(true);
  const [result, setResult] = useState<number | null>(null);
  const [calculationType, setCalculationType] = useState<
    'days' | 'workdays' | 'add'
  >('workdays');
  const [daysToAdd, setDaysToAdd] = useState<number>(10);
  const [addedDate, setAddedDate] = useState<string | null>(null);

  // UK bank holidays 2024 (simplified)
  const ukHolidays = [
    '2024-01-01', // New Year's Day
    '2024-03-29', // Good Friday
    '2024-04-01', // Easter Monday
    '2024-05-06', // Early May Bank Holiday
    '2024-05-27', // Spring Bank Holiday
    '2024-08-26', // Summer Bank Holiday
    '2024-12-25', // Christmas Day
    '2024-12-26', // Boxing Day
  ];

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const isHoliday = (date: Date): boolean => {
    const formattedDate = date.toISOString().split('T')[0];
    return ukHolidays.includes(formattedDate);
  };

  const countDays = () => {
    if (!startDate || !endDate) {
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return;
    }

    // Basic days calculation
    if (calculationType === 'days') {
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
      setResult(daysDiff);
      return;
    }

    // Workdays calculation
    if (calculationType === 'workdays') {
      let count = 0;
      let currentDate = new Date(start);

      while (currentDate <= end) {
        const isExcluded =
          (excludeWeekends && isWeekend(currentDate)) ||
          (excludeHolidays && isHoliday(currentDate));

        if (!isExcluded) {
          count++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setResult(count);
      return;
    }
  };

  const addDays = () => {
    if (!startDate || !daysToAdd) {
      return;
    }

    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return;
    }

    if (calculationType === 'add') {
      if (excludeWeekends || excludeHolidays) {
        // Add working days
        let daysAdded = 0;
        let currentDate = new Date(start);

        while (daysAdded < daysToAdd) {
          currentDate.setDate(currentDate.getDate() + 1);

          const isExcluded =
            (excludeWeekends && isWeekend(currentDate)) ||
            (excludeHolidays && isHoliday(currentDate));

          if (!isExcluded) {
            daysAdded++;
          }
        }

        setAddedDate(currentDate.toISOString().split('T')[0]);
      } else {
        // Add calendar days
        const newDate = new Date(start);
        newDate.setDate(newDate.getDate() + daysToAdd);
        setAddedDate(newDate.toISOString().split('T')[0]);
      }
    }
  };

  const handleCalculate = () => {
    if (calculationType === 'add') {
      addDays();
    } else {
      countDays();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Dates Calculator</CardTitle>
          <Tooltip content="Calculate working days between dates or add days to a date">
            <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Calculation Type
                </label>
                <select
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value as any)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-govuk-blue focus:border-govuk-blue sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="days">Count Calendar Days</option>
                  <option value="workdays">Count Working Days</option>
                  <option value="add">Add Days to Date</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {calculationType === 'add' ? 'Start Date' : 'From Date'}
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {calculationType !== 'add' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Days to Add
                  </label>
                  <Input
                    type="number"
                    value={daysToAdd}
                    onChange={(e) =>
                      setDaysToAdd(parseInt(e.target.value) || 0)
                    }
                    min={1}
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={excludeWeekends}
                    onChange={(e) => setExcludeWeekends(e.target.checked)}
                    className="h-4 w-4 text-govuk-blue focus:ring-govuk-blue border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Exclude Weekends
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={excludeHolidays}
                    onChange={(e) => setExcludeHolidays(e.target.checked)}
                    className="h-4 w-4 text-govuk-blue focus:ring-govuk-blue border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Exclude Bank Holidays
                  </label>
                </div>
              </div>

              <CustomButton onClick={handleCalculate} className="w-full">
                Calculate
              </CustomButton>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Calculation Result
            </h3>

            {calculationType !== 'add'
              ? result !== null && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        From:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(startDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        To:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {calculationType === 'workdays'
                          ? 'Working Days:'
                          : 'Calendar Days:'}
                      </span>
                      <span className="text-xl font-bold text-govuk-blue dark:text-govuk-blue">
                        {result}
                      </span>
                    </div>
                  </div>
                )
              : addedDate && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Start Date:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(startDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Days Added:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {daysToAdd}{' '}
                        {excludeWeekends || excludeHolidays
                          ? 'working days'
                          : 'calendar days'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Resulting Date:
                      </span>
                      <span className="text-xl font-bold text-govuk-blue dark:text-govuk-blue">
                        {new Date(addedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

            {(result === null && calculationType !== 'add') ||
            (addedDate === null && calculationType === 'add') ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Enter dates and click Calculate to see the result
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DatesCalculator;
