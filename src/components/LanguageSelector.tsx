import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import * as RadioGroup from '@radix-ui/react-radio-group';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'cy', name: 'Cymraeg (Welsh)' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <RadioGroup.Root
      className="flex flex-col gap-2.5"
      defaultValue={i18n.language}
      onValueChange={handleLanguageChange}
      aria-label={t('common.language')}
    >
      {languages.map((language) => (
        <div key={language.code} className="flex items-center">
          <RadioGroup.Item
            className="bg-white dark:bg-gray-700 w-5 h-5 rounded-full shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-govuk-blue focus:ring-offset-2 dark:focus:ring-offset-gray-800 data-[state=checked]:border-govuk-blue dark:data-[state=checked]:border-govuk-blue"
            value={language.code}
            id={`lang-${language.code}`}
          >
            <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-govuk-blue" />
          </RadioGroup.Item>
          <label
            className="pl-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            htmlFor={`lang-${language.code}`}
          >
            {language.name}
          </label>
        </div>
      ))}
    </RadioGroup.Root>
  );
}

export default LanguageSelector;
