import { useState, useCallback, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import { CalculatorState, Position, Size } from '../types/Calculator';
import { evaluateExpression, formatNumber } from '../utils/calculatorOperations';

const STORAGE_KEY = 'calculator-state';

interface UseCalculatorProps {
  initialPosition?: Position;
  initialSize?: Size;
  defaultVisible?: boolean;
}

export function useCalculator({
  initialPosition = { x: 20, y: 20 },
  initialSize = { width: 320, height: 480 },
  defaultVisible = false
}: UseCalculatorProps = {}) {
  // Initialize state from localStorage or defaults
  const [state, setState] = useState<CalculatorState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? {
        ...JSON.parse(saved),
        position: initialPosition,
        size: initialSize,
        isVisible: defaultVisible,
        isDragging: false,
        isResizing: false
      } : {
        position: initialPosition,
        size: initialSize,
        isDragging: false,
        isResizing: false,
        isVisible: defaultVisible,
        expression: '0',
        result: '',
        memory: null,
        operator: null,
        history: [],
        theme: 'light'
      };
    } catch {
      return {
        position: initialPosition,
        size: initialSize,
        isDragging: false,
        isResizing: false,
        isVisible: defaultVisible,
        expression: '0',
        result: '',
        memory: null,
        operator: null,
        history: [],
        theme: 'light'
      };
    }
  });

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleNumberInput = useCallback((num: string) => {
    setState(prev => {
      // If previous operation was equals, start a new calculation
      if (prev.operator === '=') {
        return {
          ...prev,
          expression: num,
          operator: null
        };
      }

      // Don't allow multiple leading zeros
      if (prev.expression === '0' && num === '0') {
        return prev;
      }

      // Replace 0 with digit unless it's a decimal point
      if (prev.expression === '0' && num !== '.') {
        return {
          ...prev,
          expression: num
        };
      }

      // Add digit to expression
      return {
        ...prev,
        expression: prev.expression + num
      };
    });
  }, []);

  const handleOperatorInput = useCallback((op: string) => {
    setState(prev => {
      if (op === '=') {
        try {
          const result = evaluateExpression(prev.expression);
          return {
            ...prev,
            expression: result,
            result: '',
            operator: '=',
            history: [...prev.history, {
              expression: prev.expression,
              result,
              timestamp: new Date()
            }]
          };
        } catch (error) {
          return {
            ...prev,
            expression: 'Error',
            result: '',
            operator: null
          };
        }
      }

      // For other operators, store current expression and prepare for next input
      return {
        ...prev,
        expression: prev.expression + op,
        operator: op
      };
    });
  }, []);

  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      expression: '0',
      result: '',
      memory: null,
      operator: null
    }));
  }, []);

  const setPosition = useCallback((position: Position) => {
    setState(prev => ({ ...prev, position }));
  }, []);

  const setSize = useCallback((size: Size) => {
    setState(prev => ({ ...prev, size }));
  }, []);

  const toggleVisibility = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  return {
    state,
    handleNumberInput,
    handleOperatorInput,
    handleClear,
    setPosition,
    setSize,
    toggleVisibility,
    setState,
    setTheme
  };
}