import React, { useEffect } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, prefix, suffix, className, containerClassName, ...props },
    ref
  ) => {
    // Prevent zoom on focus for mobile devices
    useEffect(() => {
      const viewport = document.querySelector('meta[name=viewport]');
      const originalContent = viewport?.getAttribute('content');

      const handleFocus = () => {
        viewport?.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      };

      const handleBlur = () => {
        if (originalContent) {
          viewport?.setAttribute('content', originalContent);
        }
      };

      // Collect references to all inputs to clean up properly
      const inputs = document.querySelectorAll('input, textarea, select');
      const inputsArray = Array.from(inputs); // Create array for proper cleanup

      inputsArray.forEach((input) => {
        input.addEventListener('focus', handleFocus);
        input.addEventListener('blur', handleBlur);
      });

      // Proper cleanup to prevent memory leaks
      return () => {
        inputsArray.forEach((input) => {
          input.removeEventListener('focus', handleFocus);
          input.removeEventListener('blur', handleBlur);
        });
      };
    }, []);

    return (
      <div className={clsx('space-y-1', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {prefix}
              </span>
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'block w-full rounded-md transition-colors',
              'focus:ring-govuk-blue focus:border-govuk-blue',
              'dark:bg-gray-800 dark:text-white',
              {
                'pl-7': prefix,
                'pr-7': suffix,
                'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500':
                  error,
                'border-gray-300 dark:border-gray-700': !error,
              },
              className
            )}
            style={{ fontSize: '16px' }} // Prevent zoom on iOS
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          {suffix && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {suffix}
              </span>
            </div>
          )}
        </div>
        {error && (
          <p
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            id={`${props.id}-error`}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, containerClassName, ...props }, ref) => {
    return (
      <div className={clsx('space-y-1', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'block w-full rounded-md transition-colors',
            'focus:ring-govuk-blue focus:border-govuk-blue',
            'dark:bg-gray-800 dark:text-white',
            {
              'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500':
                error,
              'border-gray-300 dark:border-gray-700': !error,
            },
            className
          )}
          style={{ fontSize: '16px' }} // Prevent zoom on iOS
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            id={`${props.id}-error`}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
Input.displayName = 'Input';
