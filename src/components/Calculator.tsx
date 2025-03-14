import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { useCalculator } from '../hooks/useCalculator';
import {
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { formatNumber } from '../utils/calculatorOperations';
import { preciseEquals } from '../utils/precisionCalculations';

interface CalculatorButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function CalculatorButton({
  onClick,
  className = '',
  children,
  disabled = false,
}: CalculatorButtonProps) {
  // Use a ref to track ripple elements
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Add ripple effect on click
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    // Get button position relative to viewport
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    // Remove existing ripples
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);

    // Clean up after animation
    setTimeout(() => {
      if (circle.parentElement === button) {
        button.removeChild(circle);
      }
    }, 600);

    onClick();
  };

  return (
    <button
      ref={buttonRef}
      onClick={createRipple}
      disabled={disabled}
      className={`calculator-button relative overflow-hidden transition-colors duration-150 
        rounded-md font-medium text-center select-none focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-govuk-blue active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

export function Calculator() {
  const { t } = useTranslation();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calculator = useCalculator();
  const { state, handleNumberInput, handleOperatorInput, handleClear } =
    calculator;

  // Clear error message after 3 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  // Error handler function for calculator operations
  const handleOperationWithErrorHandling = useCallback(
    (operation: () => void) => {
      try {
        operation();
        setShowError(false);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error'
        );
        setShowError(true);
      }
    },
    []
  );

  const handleEquals = useCallback(() => {
    handleOperationWithErrorHandling(() => {
      if (state.expression === '0' || !state.expression) {
        return;
      }

      // Check if the expression ends with an operator
      if (/[+\-*/]$/.test(state.expression)) {
        throw new Error('Invalid expression');
      }

      handleOperatorInput('=');
    });
  }, [handleOperatorInput, handleOperationWithErrorHandling, state.expression]);

  const handleNumberWithValidation = useCallback(
    (num: string) => {
      handleOperationWithErrorHandling(() => {
        // Prevent multiple decimal points
        if (num === '.' && state.expression.includes('.')) {
          const parts = state.expression.split(/[+\-*/]/);
          const currentPart = parts[parts.length - 1];

          if (currentPart.includes('.')) {
            return;
          }
        }

        // Limit the length of numbers for display
        if (state.expression.length > 15 && state.operator !== '=') {
          throw new Error('Input limit reached');
        }

        handleNumberInput(num);
      });
    },
    [
      handleNumberInput,
      handleOperationWithErrorHandling,
      state.expression,
      state.operator,
    ]
  );

  const handleOperatorWithValidation = useCallback(
    (op: string) => {
      handleOperationWithErrorHandling(() => {
        // Prevent starting with an operator except minus (for negative numbers)
        if (
          (state.expression === '0' || !state.expression) &&
          op !== '-' &&
          op !== '='
        ) {
          return;
        }

        // Prevent consecutive operators
        if (/[+\-*/]$/.test(state.expression) && op !== '=' && op !== '-') {
          // Allow replacing the previous operator
          const newExpression = state.expression.slice(0, -1) + op;
          calculator.setState((prev) => ({
            ...prev,
            expression: newExpression,
          }));
          return;
        }

        // For equals, validate expression
        if (op === '=' && /[+\-*/]$/.test(state.expression)) {
          throw new Error('Invalid expression');
        }

        // Allow negative numbers after operator
        if (op === '-' && /[+*/]$/.test(state.expression)) {
          handleNumberInput('-');
          return;
        }

        handleOperatorInput(op);
      });
    },
    [
      handleOperatorInput,
      handleNumberInput,
      handleOperationWithErrorHandling,
      state.expression,
      calculator,
    ]
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberWithValidation(e.key);
      } else if (e.key === '.') {
        handleNumberWithValidation('.');
      } else if (e.key === '+') {
        handleOperatorWithValidation('+');
      } else if (e.key === '-') {
        handleOperatorWithValidation('-');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        handleOperatorWithValidation('*');
      } else if (e.key === '/') {
        handleOperatorWithValidation('/');
      } else if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission
        handleEquals();
      } else if (e.key === 'Backspace') {
        if (state.expression !== '0') {
          calculator.setState((prev) => ({
            ...prev,
            expression:
              prev.expression.length > 1 ? prev.expression.slice(0, -1) : '0',
          }));
        }
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleNumberWithValidation,
    handleOperatorWithValidation,
    handleEquals,
    handleClear,
    calculator,
    state.expression,
  ]);

  // Format the display expression with thousand separators
  const formatDisplayExpression = () => {
    const result =
      state.operator === '='
        ? formatNumber(state.expression)
        : state.expression;
    return result;
  };

  // Determine if the result is a special value (like Error)
  const isSpecialValue = state.expression === 'Error' || showError;

  // Calculate if the display value is integer or decimal
  const displayValue = formatDisplayExpression();
  const isInteger = !displayValue.includes('.') && !isSpecialValue;

  return (
    <Card>
      <div className="p-4">
        {/* Display */}
        <div className="relative mb-4">
          <div
            className={`calculator-display w-full h-16 bg-gray-100 dark:bg-gray-700 
              rounded-md flex items-center justify-end px-4 overflow-x-auto overflow-y-hidden
              text-right ${
                isSpecialValue
                  ? 'text-red-500'
                  : 'text-gray-900 dark:text-white'
              }`}
          >
            <div className="flex-1 overflow-x-auto whitespace-nowrap text-right pr-1">
              {showError ? errorMessage : displayValue}
            </div>
          </div>

          {/* Show a small indicator if result is available */}
          {state.operator === '=' && !showError && (
            <div className="absolute right-2 bottom-1 text-xs text-govuk-blue dark:text-govuk-blue">
              =
            </div>
          )}
        </div>

        {/* Calculator buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* First row */}
          <CalculatorButton
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-600 text-white col-span-2"
          >
            C
          </CalculatorButton>
          <CalculatorButton
            onClick={() =>
              calculator.setState((prev) => ({
                ...prev,
                expression:
                  prev.expression.length > 1 && prev.expression !== 'Error'
                    ? prev.expression.slice(0, -1)
                    : '0',
              }))
            }
            className="bg-gray-300 dark:bg-gray-600 dark:text-white"
          >
            ←
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleOperatorWithValidation('/')}
            className="bg-govuk-blue/90 hover:bg-govuk-blue text-white"
          >
            ÷
          </CalculatorButton>

          {/* Second row - numbers and operations */}
          <CalculatorButton
            onClick={() => handleNumberWithValidation('7')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            7
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumberWithValidation('8')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            8
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumberWithValidation('9')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            9
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleOperatorWithValidation('*')}
            className="bg-govuk-blue/90 hover:bg-govuk-blue text-white"
          >
            ×
          </CalculatorButton>

          {/* Third row */}
          <CalculatorButton
            onClick={() => handleNumberWithValidation('4')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            4
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumberWithValidation('5')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            5
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumberWithValidation('6')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            6
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleOperatorWithValidation('-')}
            className="bg-govuk-blue/90 hover:bg-govuk-blue text-white"
          >
            <MinusIcon className="h-5 w-5 mx-auto" />
          </CalculatorButton>

          {/* Fourth row */}
          <CalculatorButton
            onClick={() => handleNumberWithValidation('1')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            1
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumberWithValidation('2')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            2
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumberWithValidation('3')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            3
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleOperatorWithValidation('+')}
            className="bg-govuk-blue/90 hover:bg-govuk-blue text-white"
          >
            <PlusIcon className="h-5 w-5 mx-auto" />
          </CalculatorButton>

          {/* Fifth row */}
          <CalculatorButton
            onClick={() => handleNumberWithValidation('0')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white col-span-2"
          >
            0
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumberWithValidation('.')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            disabled={isInteger ? false : true}
          >
            .
          </CalculatorButton>
          <CalculatorButton
            onClick={handleEquals}
            className="bg-govuk-green hover:bg-govuk-green/90 text-white"
          >
            =
          </CalculatorButton>
        </div>
      </div>
    </Card>
  );
}

export default Calculator;
