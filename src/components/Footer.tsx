import React from 'react';
import { LanguageSelector } from './LanguageSelector';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              HMRC
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.gov.uk/government/organisations/hm-revenue-customs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-govuk-blue dark:hover:text-govuk-blue"
                >
                  Official Website
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.uk/contact-hmrc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-govuk-blue dark:hover:text-govuk-blue"
                >
                  Contact HMRC
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/tax-guides"
                  className="text-gray-600 dark:text-gray-300 hover:text-govuk-blue dark:hover:text-govuk-blue"
                >
                  Tax Guides
                </a>
              </li>
              <li>
                <a
                  href="/tax-codes-explained"
                  className="text-gray-600 dark:text-gray-300 hover:text-govuk-blue dark:hover:text-govuk-blue"
                >
                  Tax Codes Explained
                </a>
              </li>
              <li>
                <a
                  href="/forms"
                  className="text-gray-600 dark:text-gray-300 hover:text-govuk-blue dark:hover:text-govuk-blue"
                >
                  Tax Forms
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Calculators
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/paye-calculator"
                  className="text-gray-600 dark:text-gray-300 hover:text-govuk-blue dark:hover:text-govuk-blue"
                >
                  PAYE Calculator
                </a>
              </li>
              <li>
                <a
                  href="/car-benefit-calculator"
                  className="text-gray-600 dark:text-gray-300 hover:text-govuk-blue dark:hover:text-govuk-blue"
                >
                  Car Benefit Calculator
                </a>
              </li>
              <li>
                <a
                  href="/comparison"
                  className="text-gray-600 dark:text-gray-300 hover:text-govuk-blue dark:hover:text-govuk-blue"
                >
                  Income Comparison
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Settings
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Choose your language
              </p>
              <LanguageSelector />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} HM Revenue & Customs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
