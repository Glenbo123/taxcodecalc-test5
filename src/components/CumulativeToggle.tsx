import { Switch } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { memo } from 'react';

export interface CumulativeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const CumulativeToggle = memo(function CumulativeToggle({
  enabled,
  onChange,
}: CumulativeToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Cumulative Calculation
        </span>
        <Tooltip content="Cumulative calculation considers all earnings since the start of the tax year. Non-cumulative (Week 1/Month 1) calculates tax based on each period independently.">
          <button className="text-govuk-blue dark:text-gray-400 hover:text-govuk-blue/80 dark:hover:text-gray-300 focus:outline-none">
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled ? 'bg-govuk-blue' : 'bg-gray-200 dark:bg-gray-700'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-govuk-blue focus:ring-offset-2`}
      >
        <span className="sr-only">
          {enabled
            ? 'Enable cumulative calculation'
            : 'Disable cumulative calculation'}
        </span>
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
});

export default CumulativeToggle;
