import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorKeypad } from './CalculatorKeypad';
import { CalculatorHeader } from './CalculatorHeader';
import { useDraggable } from './hooks/useDraggable';
import { useCalculatorHandlers } from './hooks/useCalculatorHandlers';
import { useKeyboardCalculator } from './hooks/useKeyboardCalculator';
import { Position, Size } from '../../types/Calculator';
import './Calculator.css';

export interface CalculatorProps {
  // Core behavior mode
  mode?: 'basic' | 'floating' | 'modal' | 'draggable';

  // Position and sizing (for floating/draggable modes)
  initialPosition?: Position;
  initialSize?: Size;
  defaultVisible?: boolean;

  // Callbacks
  onPositionChange?: (position: Position) => void;
  onSizeChange?: (size: Size) => void;
  onClose?: () => void;
  onCalculate?: (result: string) => void;

  // Appearance
  className?: string;
  theme?: 'light' | 'dark';
  buttonStyle?: 'minimal' | 'standard' | 'enhanced';

  // Features
  showHistory?: boolean;
  enableKeyboardInput?: boolean;
  allowDragging?: boolean;
  allowResizing?: boolean;
  showErrorMessages?: boolean;
}

export function Calculator({
  mode = 'basic',
  initialPosition = { x: 20, y: 20 },
  initialSize = { width: 320, height: 480 },
  defaultVisible = true,
  onPositionChange,
  onSizeChange,
  onClose,
  onCalculate,
  className = '',
  theme = 'light',
  buttonStyle = 'standard',
  showHistory = false,
  enableKeyboardInput = true,
  allowDragging = true,
  allowResizing = true,
  showErrorMessages = true,
}: CalculatorProps) {
  // Core calculator logic
  const calculator = useCalculator({
    initialPosition,
    initialSize,
    defaultVisible,
  });

  // Error state for validation and messages
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Enhanced handlers with validation
  const {
    handleNumberWithValidation,
    handleOperatorWithValidation,
    handleBackspace,
    handleEquals,
  } = useCalculatorHandlers(calculator, {
    showErrorMessages,
    onError: (message) => {
      setErrorMessage(message);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    },
  });

  // Dragging functionality for floating/draggable modes
  const { dragRef, dragState } = useDraggable({
    enabled: mode !== 'basic' && allowDragging,
    position: calculator.state.position,
    onPositionChange: (newPosition) => {
      calculator.setPosition(newPosition);
      onPositionChange?.(newPosition);
    },
  });

  // Resizing handler
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (!resizeRef.current || !allowResizing) return;

    const newSize = {
      width: resizeRef.current.offsetWidth,
      height: resizeRef.current.offsetHeight,
    };

    calculator.setSize(newSize);
    onSizeChange?.(newSize);
  }, [calculator, allowResizing, onSizeChange]);

  // Setup keyboard support
  useKeyboardCalculator({
    enabled: enableKeyboardInput,
    onNumber: handleNumberWithValidation,
    onOperator: handleOperatorWithValidation,
    onEquals: handleEquals,
    onClear: calculator.handleClear,
    onBackspace: handleBackspace,
  });

  // Effect to track resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (resizeRef.current && allowResizing) {
      resizeObserver.observe(resizeRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize, allowResizing]);

  // Exit early if not visible
  if (!calculator.state.isVisible) {
    return null;
  }

  // Compute style based on mode
  const getContainerStyle = (): React.CSSProperties => {
    if (mode === 'basic') {
      return {};
    }

    return {
      position: 'fixed',
      top: `${calculator.state.position.y}px`,
      left: `${calculator.state.position.x}px`,
      width: `${calculator.state.size.width}px`,
      height: `${calculator.state.size.height}px`,
      zIndex: 75,
      resize: allowResizing ? 'both' : 'none',
      overflow: 'auto',
    };
  };

  // Callback when calculation is complete
  const handleCalculationComplete = useCallback(
    (result: string) => {
      onCalculate?.(result);
    },
    [onCalculate]
  );

  return (
    <div
      ref={(el) => {
        // Combine refs for both dragging and resizing
        if (typeof dragRef === 'function') {
          dragRef(el);
        }
        resizeRef.current = el as HTMLDivElement | null;
      }}
      className={`calculator-container ${className} ${
        dragState.isDragging ? 'calculator-dragging' : ''
      }`}
      style={getContainerStyle()}
      data-mode={mode}
      data-theme={theme}
    >
      {/* Render header for draggable/floating modes */}
      {(mode === 'floating' || mode === 'draggable' || mode === 'modal') && (
        <CalculatorHeader
          onClose={onClose || calculator.toggleVisibility}
          isDraggable={allowDragging}
        />
      )}

      {/* Calculator display with error handling */}
      <CalculatorDisplay
        expression={calculator.state.expression}
        error={showError ? errorMessage : undefined}
        showEquals={calculator.state.operator === '='}
      />

      {/* Calculator keypad */}
      <CalculatorKeypad
        onNumberPress={handleNumberWithValidation}
        onOperatorPress={handleOperatorWithValidation}
        onClear={calculator.handleClear}
        onBackspace={handleBackspace}
        onEquals={handleEquals}
        buttonStyle={buttonStyle}
      />

      {/* History (optional) */}
      {showHistory && calculator.state.history.length > 0 && (
        <div className="calculator-history">
          <div className="calculator-history-header">
            <h4>History</h4>
          </div>
          <div className="calculator-history-content">
            {calculator.state.history.map((item, index) => (
              <div key={index} className="calculator-history-item">
                <div className="calculator-history-expression">
                  {item.expression}
                </div>
                <div className="calculator-history-result">{item.result}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;
