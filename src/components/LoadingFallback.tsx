import { useTranslation } from 'react-i18next';

interface LoadingFallbackProps {
  message?: string;
}

export function LoadingFallback({ message }: LoadingFallbackProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center justify-center min-h-[60vh]"
      role="status"
      aria-live="polite"
    >
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
        <span>{message || t('common.loading')}</span>
      </div>
    </div>
  );
}
