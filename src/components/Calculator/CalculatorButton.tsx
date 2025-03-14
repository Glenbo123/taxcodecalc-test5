import React, { useRef, useCallback } from 'react';

export type ButtonVariant =
  | 'number'
  | 'operator'
  | 'memory'
  | 'function'
  | 'equals'
  | 'clear';

interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  title?: string;
  // Add support for keyboard shortcuts
  keyboardShortcut?: string;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  children,
  onClick,
  variant = 'number',
  className = '',
  ariaLabel,
  disabled = false,
  size = 'medium',
  fullWidth = false,
  title,
  keyboardShortcut,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Enhanced ripple effect with TypeScript safety
  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const button = buttonRef.current;
      if (!button) return;

      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      const rect = button.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - rect.left - radius}px`;
      circle.style.top = `${event.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      // Remove existing ripple
      const existingRipple = button.getElementsByClassName('ripple')[0];
      if (existingRipple) {
        existingRipple.remove();
      }

      button.appendChild(circle);

      // Cleanup ripple effect
      const removeRipple = () => {
        if (circle.parentElement === button) {
          button.removeChild(circle);
        }
      };

      circle.addEventListener('animationend', removeRipple);
      setTimeout(removeRipple, 600);
    },
    [disabled]
  );

  // Get variant-specific classes
  const getVariantClasses = useCallback(() => {
    switch (variant) {
      case 'operator':
        return 'calculator-button-operator';
      case 'memory':
        return 'calculator-button-memory';
      case 'function':
        return 'calculator-button-function';
      case 'equals':
        return 'calculator-button-equals';
      case 'clear':
        return 'calculator-button-clear';
      default:
        return 'calculator-button-number';
    }
  }, [variant]);

  // Get size-specific classes
  const getSizeClasses = useCallback(() => {
    switch (size) {
      case 'small':
        return 'text-base py-2 px-3';
      case 'large':
        return 'text-2xl py-4 px-5';
      default:
        return 'text-lg py-3 px-4';
    }
  }, [size]);

  return (
    <button
      ref={buttonRef}
      onClick={(e) => {
        createRipple(e);
        onClick();
      }}
      className={`
        calculator-button
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
        relative
        overflow-hidden
        rounded-md
        font-medium
        transition-all
        duration-150
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-govuk-blue
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      data-keyboard-shortcut={keyboardShortcut}
    >
      {/* Main content */}
      <span className="relative z-10">{children}</span>

      {/* Keyboard shortcut indicator */}
      {keyboardShortcut && (
        <span className="absolute bottom-1 right-1 text-xs opacity-50">
          {keyboardShortcut}
        </span>
      )}
    </button>
  );
};

// Add displayName for better debugging
CalculatorButton.displayName = 'CalculatorButton';

export default CalculatorButton;
