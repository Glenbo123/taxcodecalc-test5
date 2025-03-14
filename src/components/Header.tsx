import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';
import { CrownLogo } from './CrownLogo';
import { ThemeToggle } from './ThemeToggle';

export const Header = React.memo(() => {
  const { t } = useTranslation();

  return (
    <header className="bg-govuk-blue dark:bg-primary-900 sticky top-0 z-[60] border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Sidebar />
            <div className="flex items-center ml-3">
              <div className="flex-shrink-0">
                <CrownLogo />
              </div>
              <div className="border-l border-white/30 pl-4 ml-4">
                <h1 className="text-xl font-bold text-white leading-tight">
                  HM Revenue & Customs
                </h1>
                <h2 className="text-lg text-white/90 font-medium leading-tight">
                  {t('common.taxCalculator')}
                </h2>
              </div>
            </div>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
});
