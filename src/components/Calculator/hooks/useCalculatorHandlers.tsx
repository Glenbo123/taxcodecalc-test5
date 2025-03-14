import { useCallback } from 'react';
import { CalculatorState } from '../../../types/Calculator';

interface UseCalculatorHandlersOptions {
  showErrorMessages: boolean;
  onError: (message: string) => void;
}

export const useCalculatorHandlers = (
  calculator: {
    state: CalculatorState;
    handleNumberInput: (num: string) => void;
    handleOperatorInput: (op: string) => void;
    handleClear: () => void;
    setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  },
  options: UseCalculatorHandlersOptions
) => {
  const { showErrorMessages, onError } = options;

  // Error handler function for calculator operations
  const handleOperationWithErrorHandling = useCallback(
    (operation: () => void) => {
      try {
        operation();
      } catch (error) {
        if (showErrorMessages) {
          onError(error instanceof Error ? error.message : 'Unknown error');
        }
      }
    },
    [showErrorMessages, onError]
  );

  const handleNumberWithValidation = useCallback(
    (num: string) => {
      handleOperationWithErrorHandling(() => {
        // Prevent multiple decimal points
        const lastNumber = calculator.state.expression.split(/[+\-*/]/).pop();
        if (num === '.' && lastNumber?.includes('.')) return;
        {
          const parts = calculator.state.expression.split(/[+\-*/]/);
          const currentPart = parts[parts.length - 1];

          if (currentPart.includes('.')) {
            return;
          }
        }

        // Limit the length of numbers for display
        if (
          calculator.state.expression.length > 15 &&
          calculator.state.operator !== '='
        ) {
          throw new Error('Input limit reached');
        }

        calculator.handleNumberInput(num);
      });
    },
    [calculator, handleOperationWithErrorHandling]
  );

  const handleOperatorWithValidation = useCallback(
    (op: string) => {
      handleOperationWithErrorHandling(() => {
        // Prevent starting with an operator except minus (for negative numbers)
        if (
          (calculator.state.expression === '0' ||
            !calculator.state.expression) &&
          op !== '-' &&
          op !== '='
        ) {
          return;
        }

        // Prevent consecutive operators
        if (
          /[+\-*/]$/.test(calculator.state.expression) &&
          op !== '=' &&
          op !== '-'
        ) {
          // Allow replacing the previous operator
          const newExpression = calculator.state.expression.slice(0, -1) + op;
          calculator.setState((prev) => ({
            ...prev,
            expression: newExpression,
          }));
          return;
        }

        // For equals, validate expression
        if (op === '=' && /[+\-*/]$/.test(calculator.state.expression)) {
          throw new Error('Invalid expression');
        }

        // Allow negative numbers after operator
        if (op === '-' && /[+*/]$/.test(calculator.state.expression)) {
          calculator.handleNumberInput('-');
          return;
        }

        calculator.handleOperatorInput(op);
      });
    },
    [calculator, handleOperationWithErrorHandling]
  );

  const handleBackspace = useCallback(() => {
    if (calculator.state.expression !== '0') {
      calculator.setState((prev) => ({
        ...prev,
        expression:
          prev.expression.length > 1 ? prev.expression.slice(0, -1) : '0',
      }));
    }
  }, [calculator]);

  const handleEquals = useCallback(() => {
    handleOperationWithErrorHandling(() => {
      if (calculator.state.expression === '0' || !calculator.state.expression) {
        return;
      }

      // Check if the expression ends with an operator
      if (/[+\-*/]$/.test(calculator.state.expression)) {
        throw new Error('Invalid expression');
      }

      calculator.handleOperatorInput('=');
    });
  }, [calculator, handleOperationWithErrorHandling]);

  return {
    handleNumberWithValidation,
    handleOperatorWithValidation,
    handleBackspace,
    handleEquals,
  };
};

export default useCalculatorHandlers;
