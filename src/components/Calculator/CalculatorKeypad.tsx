import React, { useMemo } from 'react';
import { CalculatorButton } from './CalculatorButton';
import {
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  BackspaceIcon,
  CalculatorIcon,
  PercentBadgeIcon,
} from '@heroicons/react/24/outline';

interface CalculatorKeypadProps {
  onNumberPress: (num: string) => void;
  onOperatorPress: (op: string) => void;
  onFunctionPress?: (func: 'sqrt' | 'square' | 'percent' | 'plusMinus') => void;
  onMemoryPress?: (action: 'MC' | 'MR' | 'M+' | 'M-') => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  buttonStyle?: 'minimal' | 'standard' | 'enhanced';
  hasMemory?: boolean;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onNumberPress,
  onOperatorPress,
  onFunctionPress,
  onMemoryPress,
  onClear,
  onBackspace,
  onEquals,
  buttonStyle = 'standard',
  hasMemory = false,
}) => {
  // Button style configuration
  const styles = useMemo(
    () => ({
      number: `bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white 
      ${buttonStyle === 'enhanced' ? 'shadow-sm hover:shadow-md' : ''}`,
      operator: `bg-govuk-blue/90 hover:bg-govuk-blue text-white
      ${buttonStyle === 'enhanced' ? 'shadow-md hover:shadow-lg' : ''}`,
      function: `bg-gray-300 dark:bg-gray-600 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500
      ${buttonStyle === 'enhanced' ? 'shadow-sm hover:shadow-md' : ''}`,
      memory: `bg-purple-500 hover:bg-purple-600 text-white
      ${buttonStyle === 'enhanced' ? 'shadow-md hover:shadow-lg' : ''}`,
      clear: `bg-red-500 hover:bg-red-600 text-white
      ${buttonStyle === 'enhanced' ? 'shadow-md hover:shadow-lg' : ''}`,
      equals: `bg-govuk-green hover:bg-govuk-green/90 text-white
      ${buttonStyle === 'enhanced' ? 'shadow-md hover:shadow-lg' : ''}`,
    }),
    [buttonStyle]
  );

  return (
    <div className="calculator-keypad p-4 space-y-2">
      {/* Memory Buttons */}
      {onMemoryPress && (
        <div className="grid grid-cols-4 gap-2">
          <CalculatorButton onClick={() => onMemoryPress('MC')} className={styles.memory} disabled={!hasMemory}>
            MC
          </CalculatorButton>
          <CalculatorButton onClick={() => onMemoryPress('MR')} className={styles.memory} disabled={!hasMemory}>
            MR
          </CalculatorButton>
          <CalculatorButton onClick={() => onMemoryPress('M+')} className={styles.memory}>
            M+
          </CalculatorButton>
          <CalculatorButton onClick={() => onMemoryPress('M-')} className={styles.memory}>
            M-
          </CalculatorButton>
        </div>
      )}

      {/* Function Buttons */}
      {onFunctionPress && (
        <div className="grid grid-cols-4 gap-2">
          <CalculatorButton onClick={() => onFunctionPress('sqrt')} className={styles.function}>
            √
          </CalculatorButton>
          <CalculatorButton onClick={() => onFunctionPress('square')} className={styles.function}>
            x²
          </CalculatorButton>
          <CalculatorButton onClick={() => onFunctionPress('percent')} className={styles.function}>
            <PercentBadgeIcon className="h-6 w-6 mx-auto" aria-hidden="true" />
          </CalculatorButton>
          <CalculatorButton onClick={() => onFunctionPress('plusMinus')} className={styles.function}>
            ±
          </CalculatorButton>
        </div>
      )}

      {/* Main Keypad Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Clear and Backspace Row */}
        <CalculatorButton onClick={onClear} className={`${styles.clear} col-span-2`}>
          C
        </CalculatorButton>
        <CalculatorButton onClick={onBackspace} className={styles.function}>
          <BackspaceIcon className="h-5 w-5 mx-auto" aria-hidden="true" />
        </CalculatorButton>
        <CalculatorButton onClick={() => onOperatorPress('/')} className={styles.operator}>
          ÷
        </CalculatorButton>

        {/* Number Pad and Operations */}
        {[7, 8, 9, '*', 4, 5, 6, '-', 1, 2, 3, '+', 0, '.', '%', '='].map((key) => {
          if (typeof key === 'number' || key === '.') {
            return (
              <CalculatorButton key={key} onClick={() => onNumberPress(key.toString())} className={styles.number}>
                {key}
              </CalculatorButton>
            );
          } else if (key === '=') {
            return (
              <CalculatorButton key={key} onClick={onEquals} className={styles.equals}>
                =
              </CalculatorButton>
            );
          } else {
            const operatorIcons = {
              '*': <XMarkIcon className="h-5 w-5 mx-auto" aria-hidden="true" />,
              '-': <MinusIcon className="h-5 w-5 mx-auto" aria-hidden="true" />,
              '+': <PlusIcon className="h-5 w-5 mx-auto" aria-hidden="true" />,
              '%': <PercentBadgeIcon className="h-5 w-5 mx-auto" aria-hidden="true" />,
            };

            return (
              <CalculatorButton key={key} onClick={() => onOperatorPress(key)} className={styles.operator}>
                {operatorIcons[key as keyof typeof operatorIcons]}
              </CalculatorButton>
            );
          }
        })}
      </div>

      {/* Calculator & ArrowsUpDown Icons */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <CalculatorButton onClick={() => {}} className={styles.function} ariaLabel="Calculator">
          <CalculatorIcon className="h-6 w-6 mx-auto" aria-hidden="true" />
        </CalculatorButton>
        <CalculatorButton onClick={() => {}} className={styles.function} ariaLabel="Swap">
          <ArrowsUpDownIcon className="h-6 w-6 mx-auto" aria-hidden="true" />
        </CalculatorButton>
      </div>
    </div>
  );
};

CalculatorKeypad.displayName = 'CalculatorKeypad';

export default CalculatorKeypad;
