import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const historicalTaxData = [
  {
    year: '2020-21',
    personalAllowance: 12500,
    basicRate: 20,
    higherRate: 40,
    additionalRate: 45,
  },
  {
    year: '2021-22',
    personalAllowance: 12570,
    basicRate: 20,
    higherRate: 40,
    additionalRate: 45,
  },
  {
    year: '2022-23',
    personalAllowance: 12570,
    basicRate: 20,
    higherRate: 40,
    additionalRate: 45,
  },
  {
    year: '2023-24',
    personalAllowance: 12570,
    basicRate: 20,
    higherRate: 40,
    additionalRate: 45,
  },
  {
    year: '2024-25',
    personalAllowance: 12570,
    basicRate: 20,
    higherRate: 40,
    additionalRate: 45,
  },
];

const historicalThresholds = [
  { year: '2020-21', basic: 37500, higher: 150000 },
  { year: '2021-22', basic: 37700, higher: 150000 },
  { year: '2022-23', basic: 37700, higher: 150000 },
  { year: '2023-24', basic: 37700, higher: 125140 },
  { year: '2024-25', basic: 37700, higher: 125140 },
];

export function TaxYears() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Historical Tax Rates and Thresholds
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Personal Allowance
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalTaxData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="personalAllowance"
                    name="Personal Allowance"
                    stroke="#008476"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tax Rates
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalTaxData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="basicRate"
                    name="Basic Rate"
                    stroke="#008476"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="higherRate"
                    name="Higher Rate"
                    stroke="#d4351c"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="additionalRate"
                    name="Additional Rate"
                    stroke="#00703c"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tax Thresholds
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalThresholds}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="basic"
                    name="Basic Rate Threshold"
                    stroke="#008476"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="higher"
                    name="Higher Rate Threshold"
                    stroke="#d4351c"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
