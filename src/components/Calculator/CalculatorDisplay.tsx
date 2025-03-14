import React, { useEffect, useRef } from 'react';

interface CalculatorDisplayProps {
  expression: string;
  previousExpression?: string;
  error?: string;
  showEquals?: boolean;
  hasMemory?: boolean;
  result?: string;
  isCalculating?: boolean;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  previousExpression,
  error,
  showEquals = false,
  hasMemory = false,
  result,
  isCalculating = false,
}) => {
  const displayRef = useRef<HTMLDivElement>(null);
  const isError = !!error;
  const displayValue = isError ? error : expression;

  // Auto scroll to end when expression changes
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [displayValue]);

  // Format number with thousand separators
  const formatNumber = (num: string) => {
    if (isError) return num;
    const [intPart, decPart] = num.split('.');
    return (
      intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      (decPart ? '.' + decPart : '')
    );
  };

  return (
    <div className="calculator-display-container w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2">
      {/* Previous Expression */}
      {previousExpression && !isError && (
        <div 
          className="text-sm text-gray-500 dark:text-gray-400 text-right h-5 mb-1 px-2"
          aria-live="polite"
          aria-atomic="true"
        >
          {previousExpression}
        </div>
      )}

      {/* Main Display */}
      <div
        ref={displayRef}
        role="textbox"
        aria-label="Calculation result"
        aria-readonly="true"
        className={`
          calculator-display
          min-h-[3rem]
          bg-gray-50
          dark:bg-gray-800
          rounded-md
          flex
          flex-col
          items-end
          justify-center
          px-4
          py-2
          relative
          ${isCalculating ? 'animate-pulse' : ''}
        `}
      >
        {/* Memory Indicator */}
        {hasMemory && (
          <div className="absolute top-1 left-2 text-xs font-medium text-purple-600 dark:text-purple-400">
            M
          </div>
        )}

        {/* Main Expression/Result */}
        <div
          className={`
    flex-1
    overflow-x-auto
    whitespace-nowrap
    text-right
    pr-1
    transition-all
    duration-200
    ${isError ? 'text-red-500 animate-shake' : 'text-gray-900 dark:text-white'}
    ${
      displayValue.length > 12
        ? 'text-lg'
        : displayValue.length > 8
        ? 'text-xl'
        : 'text-2xl'
    }
    font-medium
    scrollbar-thin
    scrollbar-thumb-gray-300
    dark:scrollbar-thumb-gray-600
  `}
        >
          {formatNumber(displayValue)}
        </div>

        {/* Result Preview */}
        {result && !isError && !showEquals && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            = {formatNumber(result)}
          </div>
        )}

        {/* Equals Indicator */}
        {showEquals && !isError && (
          <div className="absolute right-2 bottom-1 text-xs font-medium text-govuk-blue dark:text-govuk-blue">
            =
          </div>
        )}

        {/* Error Icon */}
        {isError && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgb(209, 213, 219);
          border-radius: 2px;
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgb(75, 85, 99);
        }

        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }

        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

// Add displayName for better debugging
CalculatorDisplay.displayName = 'CalculatorDisplay';

export default CalculatorDisplay;
