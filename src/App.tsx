import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './components/ThemeToggle';
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Calculator } from './pages/Calculator';
import { HelpButton } from './components/HelpButton';
import { Suspense, lazy, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import './styles/hmrc.scss';
import { Home } from './pages/Home';
import { UnifiedCalculator } from './components/UnifiedCalculator';
import { debugRouter } from './utils/debug';
import { Footer } from './components/Footer';
import { CalculatorIcon, Bars3Icon } from '@heroicons/react/24/outline';

// Lazy load components with consistent naming
const Comparison = lazy(() => import('./pages/Comparison'));
const Export = lazy(() =>
  import('./pages/Export').then((module) => ({ default: module.Export }))
);
const TaxYears = lazy(() =>
  import('./pages/TaxYears').then((module) => ({ default: module.TaxYears }))
);
const Benefits = lazy(() =>
  import('./pages/Benefits').then((module) => ({ default: module.Benefits }))
);
const Forms = lazy(() =>
  import('./pages/Forms').then((module) => ({ default: module.Forms }))
);
const PayeCalculator = lazy(() =>
  import('./pages/PayeCalculator').then((module) => ({
    default: module.PayeCalculator,
  }))
);
const TaxGuides = lazy(() => import('./pages/TaxGuides'));
const TaxCodesExplained = lazy(() => import('./pages/TaxCodesExplained'));
const TrainingModule = lazy(() => import('./pages/TrainingModule'));
const CarBenefitCalculator = lazy(() =>
  import('./components/CarBenefitCalculator').then((module) => ({
    default: module.CarBenefitCalculator,
  }))
);
const DatesCalculator = lazy(() => import('./pages/DatesCalculator'));
const PeriodTaxCalculator = lazy(() => import('./pages/PeriodTaxCalculator'));

function App() {
  const { t } = useTranslation();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Log route changes in development
  useEffect(() => {
    debugRouter('Route changed:', location.pathname);
  }, [location]);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-govuk-blue animate-pulse flex items-center gap-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {t('common.loading')}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-govuk-grey dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-[60] bg-[#008476]">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:text-white/80 p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isSidebarOpen}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="hmrc-banner">
              <div className="hmrc-organisation-logo">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32px"
                  height="32px"
                  viewBox="0 0 45.35 45.35"
                  focusable="false"
                  aria-hidden="true"
                  className="flex-shrink-0"
                >
                  <path className="cls-1" d="M28.5,16.6c.82-.34,1.22-1.29.88-2.12-.34-.83-1.3-1.24-2.12-.9-.84.34-1.23,1.31-.89,2.14.34.83,1.3,1.23,2.14.88Z"/>
                  <path className="cls-1" d="M22.06,19.36c-.84.34-1.23,1.31-.89,2.14.34.83,1.3,1.23,2.14.88.82-.34,1.22-1.29.88-2.12-.34-.83-1.3-1.24-2.12-.9Z"/>
                  <path className="cls-1" d="M32.86,19.2c.82-.34,1.22-1.29.88-2.12-.34-.83-1.3-1.24-2.12-.9-.84.34-1.23,1.31-.89,2.14.34.83,1.3,1.23,2.14.88Z"/>
                  <path className="cls-1" d="M33.62,22.63c.34.83,1.3,1.23,2.14.88.82-.34,1.22-1.29.88-2.12-.34-.83-1.3-1.24-2.12-.9-.84.34-1.23,1.31-.89,2.14Z"/>
                </svg>
                <p className="govuk-body-s">HM Revenue &amp; Customs</p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/export" element={<Export />} />
              <Route path="/tax-years" element={<TaxYears />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/forms" element={<Forms />} />
              <Route path="/paye-calculator" element={<PayeCalculator />} />
              <Route path="/tax-guides" element={<TaxGuides />} />
              <Route path="/tax-codes-explained" element={<TaxCodesExplained />} />
              <Route path="/training" element={<TrainingModule />} />
              <Route path="/car-benefit-calculator" element={<CarBenefitCalculator />} />
              <Route path="/dates-calculator" element={<DatesCalculator />} />
              <Route path="/period-tax-calculator" element={<PeriodTaxCalculator />} />
              <Route path="*" element={<Navigate to="/" replace />} aria-label="404 redirect" />
            </Routes>
          </Suspense>
        </main>
      </div>

      <Footer />

      <div className="fixed-tools">
        <HelpButton />
        {isCalculatorOpen && (
          <UnifiedCalculator
            mode="floating"
            defaultVisible={true}
            initialPosition={{ x: 20, y: 20 }}
          />
        )}
        <button
          onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
          className="bg-govuk-blue text-white p-3 rounded-full shadow-lg hover:bg-govuk-blue/90 transition-colors"
          aria-label="Toggle calculator"
        >
          <CalculatorIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default App;