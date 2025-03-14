import { useEffect } from 'react';

interface UseKeyboardCalculatorOptions {
  enabled: boolean;
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
}

export const useKeyboardCalculator = (
  options: UseKeyboardCalculatorOptions
) => {
  const { enabled, onNumber, onOperator, onEquals, onClear, onBackspace } =
    options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        return;
      }

      const keyMap: Record<string, () => void> = {
        '.': () => onNumber('.'),
        '+': () => onOperator('+'),
        '-': () => onOperator('-'),
        '*': () => onOperator('*'),
        '/': () => onOperator('/'),
        '=': onEquals,
        Enter: onEquals,
        Backspace: onBackspace,
        Escape: onClear,
        Delete: onClear,
      };

      if (keyMap[e.key]) {
        e.preventDefault();
        keyMap[e.key]();
      } else if (/\d/.test(e.key)) {
        onNumber(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onNumber, onOperator, onEquals, onClear, onBackspace]);
};

export default useKeyboardCalculator;
