import React, { useState } from 'react';
import {
  XMarkIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';

interface CalculatorHeaderProps {
  onClose?: () => void;
  isDraggable?: boolean;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  title?: string;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  onClose,
  isDraggable = false,
  isMinimized = false,
  onMinimize,
  onMaximize,
  isMaximized = false,
  title = 'Calculator',
}) => {
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Handle mouse events for dragging
  const handleMouseDown = () => isDraggable && setIsGrabbing(true);
  const handleMouseUp = () => setIsGrabbing(false);
  const handleMouseLeave = () => setIsGrabbing(false);

  return (
    <div
      className={`
        calculator-header
        bg-gradient-to-r
        from-govuk-blue
        to-govuk-blue-dark
        px-4
        py-3
        flex
        items-center
        justify-between
        select-none
        ${isDraggable ? (isGrabbing ? 'cursor-grabbing' : 'cursor-grab') : ''}
        transition-colors
        duration-200
      `}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left side - Title and Icon */}
      <div className="flex items-center space-x-2">
        <CalculatorIcon className="h-5 w-5 text-white opacity-80" />
        <h3 className="text-sm font-semibold text-white tracking-wide">
          {title}
        </h3>
      </div>

      {/* Right side - Control buttons */}
      <div className="flex items-center space-x-1">
        {/* Minimize button */}
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="
              header-control-button
              group
              p-1.5
              rounded
              hover:bg-white/10
              focus:outline-none
              focus:ring-2
              focus:ring-white/20
              transition-colors
            "
            aria-label={
              isMinimized ? 'Restore calculator' : 'Minimize calculator'
            }
            title={isMinimized ? 'Restore' : 'Minimize'}
          >
            <MinusIcon className="h-4 w-4 text-white opacity-80 group-hover:opacity-100" />
          </button>
        )}

        {/* Maximize button */}
        {onMaximize && (
          <button
            onClick={onMaximize}
            className="
              header-control-button
              group
              p-1.5
              rounded
              hover:bg-white/10
              focus:outline-none
              focus:ring-2
              focus:ring-white/20
              transition-colors
            "
            aria-label={
              isMaximized ? 'Restore calculator size' : 'Maximize calculator'
            }
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <ArrowsPointingInIcon className="h-4 w-4 text-white opacity-80 group-hover:opacity-100" />
            ) : (
              <ArrowsPointingOutIcon className="h-4 w-4 text-white opacity-80 group-hover:opacity-100" />
            )}
          </button>
        )}

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="
              header-control-button
              group
              p-1.5
              rounded
              hover:bg-red-500
              focus:outline-none
              focus:ring-2
              focus:ring-red-500/20
              transition-colors
            "
            aria-label="Close calculator"
            title="Close"
          >
            <XMarkIcon className="h-4 w-4 text-white opacity-80 group-hover:opacity-100" />
          </button>
        )}
      </div>

      {/* Optional: Add a drag handle indicator when draggable */}
      {isDraggable && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10" />
      )}
    </div>
  );
};

// Add custom styles to the component
const styles = `
  .header-control-button {
    opacity: 0.9;
    transition: all 0.2s ease;
  }

  .header-control-button:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  .header-control-button:active {
    transform: scale(0.95);
  }

  @media (max-width: 640px) {
    .calculator-header {
      padding: 0.5rem 1rem;
    }
  }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

CalculatorHeader.displayName = 'CalculatorHeader';

export default CalculatorHeader;
