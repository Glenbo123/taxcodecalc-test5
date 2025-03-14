import { Decimal } from 'decimal.js';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CalculatorState {
  position: Position;
  size: Size;
  isDragging: boolean;
  isResizing: boolean;
  isVisible: boolean;
  expression: string;
  result: string;
  memory: string | null;
  operator: string | null;
  history: CalculationHistory[];
  theme: 'light' | 'dark';
}

export interface CalculationHistory {
  expression: string;
  result: string;
  timestamp: Date;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  lastTap: number;
  dragOffset: Position;
}

export interface CalculatorProps {
  mode: 'fixed' | 'floating' | 'draggable';
  initialPosition?: Position;
  initialSize?: Size;
  defaultVisible?: boolean;
  onPositionChange?: (position: Position) => void;
  onSizeChange?: (size: Size) => void;
  className?: string;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export interface CalculatorOperation {
  type: 'number' | 'operator' | 'function';
  value: string;
  display: string;
  ariaLabel: string;
}

export interface CalculatorMemory {
  value: Decimal;
  operation: 'add' | 'subtract' | 'clear' | 'recall';
  timestamp: Date;
}
