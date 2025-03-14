import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { Position, Size } from '../types/Calculator';
import { Calculator } from './Calculator';

interface UnifiedCalculatorProps {
  mode: 'fixed' | 'floating' | 'draggable';
  initialPosition?: Position;
  initialSize?: Size;
  defaultVisible?: boolean;
  onPositionChange?: (position: Position) => void;
  onSizeChange?: (size: Size) => void;
  className?: string;
}

export function UnifiedCalculator({
  mode = 'draggable',
  initialPosition = { x: 20, y: 20 },
  initialSize = { width: 320, height: 480 },
  defaultVisible = false,
  onPositionChange,
  onSizeChange,
  className = '',
}: UnifiedCalculatorProps) {
  const {
    state,
    handleNumberInput,
    handleOperatorInput,
    handleClear,
    setPosition,
    setSize,
    toggleVisibility,
  } = useCalculator({
    initialPosition,
    initialSize,
    defaultVisible,
  });

  return (
    <Calculator
      mode={mode}
      initialPosition={initialPosition}
      initialSize={initialSize}
      defaultVisible={defaultVisible}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      className={className}
      allowDragging={true}
      allowResizing={true}
      showHistory={false}
      enableKeyboardInput={true}
      buttonStyle="standard"
      showErrorMessages={true}
      onClose={toggleVisibility}
    />
  );
}

export default UnifiedCalculator;
