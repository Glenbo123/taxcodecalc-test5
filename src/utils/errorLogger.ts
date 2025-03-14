/**
 * Centralized error logging utility for consistent error handling across the application.
 *
 * This utility provides a standardized way to log errors, with optional context information.
 * It can be extended to integrate with external error tracking services as needed.
 */

// Error severity levels
export enum ErrorSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

// Error context interface
export interface ErrorContext {
  component?: string;
  operation?: string;
  userId?: string;
  [key: string]: unknown;
}

/**
 * Log an error with optional context information
 * @param error The error to log
 * @param context Additional context information about the error
 * @param severity The error severity level
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export function logError(
  error: Error | string,
  context?: ErrorContext,
  severity: ErrorSeverity = ErrorSeverity.ERROR
): void {
  // Add error tracking metadata
  const errorMeta = {
    timestamp: new Date().toISOString(),
    errorType: error instanceof Error ? error.constructor.name : 'Unknown',
    browserInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform
    }
  };
  // Convert string errors to Error objects
  const errorObj = typeof error === 'string' ? new Error(error) : error;

  // Create error log entry
  const errorLog = {
    severity,
    message: errorObj.message,
    stack: errorObj.stack,
    context: sanitizeContext(context),
    timestamp: new Date().toISOString(),
    source: 'uk-tax-calculator',
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    switch (severity) {
      case ErrorSeverity.INFO:
        console.info(`[${severity}]`, errorLog);
        break;
      case ErrorSeverity.WARNING:
        console.warn(`[${severity}]`, errorLog);
        break;
      case ErrorSeverity.CRITICAL:
        console.error(`[${severity}]`, errorLog);
        break;
      case ErrorSeverity.ERROR:
      default:
        console.error(`[${severity}]`, errorLog);
    }
  } else {
    // In production, we may want to add integration with an error tracking service
    // Example: Sentry, LogRocket, etc.
    // sentryClient.captureException(errorObj, { extra: context });

    // For now, just log to console but with less detail
    if (
      severity === ErrorSeverity.CRITICAL ||
      severity === ErrorSeverity.ERROR
    ) {
      console.error(`[${severity}] ${errorObj.message}`);
    }
  }

  // Store in localStorage for debugging (limited to last 50 errors)
  storeErrorInLocalStorage(errorLog);
}

/**
 * Log a warning with optional context information
 * @param message The warning message
 * @param context Additional context information
 */
export function logWarning(message: string, context?: ErrorContext): void {
  logError(new Error(message), context, ErrorSeverity.WARNING);
}

/**
 * Log informational message with optional context
 * @param message The informational message
 * @param context Additional context information
 */
export function logInfo(message: string, context?: ErrorContext): void {
  logError(new Error(message), context, ErrorSeverity.INFO);
}

/**
 * Log critical error with optional context
 * @param error The critical error
 * @param context Additional context information
 */
export function logCritical(
  error: Error | string,
  context?: ErrorContext
): void {
  logError(error, context, ErrorSeverity.CRITICAL);
}

/**
 * Remove sensitive information from error context
 * @param context The error context to sanitize
 * @returns Sanitized context object
 */
function sanitizeContext(context?: ErrorContext): ErrorContext | undefined {
  if (!context) return undefined;

  const sanitized = { ...context };

  // Remove sensitive information
  const sensitiveKeys = new Set([
    'password', 'token', 'apikey', 'secret', 'authorization', 'accesstoken',
    'refreshtoken', 'sessionid', 'x-api-key', 'bearer', 'basic',
    'credentials', 'key', 'private', 'salt'
  ]);

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.has(key.toLowerCase()) || 
        key.toLowerCase().includes('secret') ||
        key.toLowerCase().includes('token')) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Store error in localStorage for debugging purposes
 * @param errorLog The error log entry
 */
function storeErrorInLocalStorage(errorLog: Record<string, unknown>): void {
  try {
    const key = 'uk-tax-calculator-errors';
    const storedErrors = localStorage.getItem(key);
    let errors = storedErrors ? JSON.parse(storedErrors) : [];

    // Limit to last 50 errors
    errors = [errorLog, ...errors].slice(0, 50);

    localStorage.setItem(key, JSON.stringify(errors));
  } catch (e) {
    // Silent fail if localStorage is not available or quota is exceeded
  }
}

/**
 * Get all stored errors from localStorage
 * @returns Array of stored error logs
 */
export function getStoredErrors(): Record<string, unknown>[] {
  try {
    const key = 'uk-tax-calculator-errors';
    const storedErrors = localStorage.getItem(key);
    return storedErrors ? JSON.parse(storedErrors) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Clear all stored errors from localStorage
 */
export function clearStoredErrors(): void {
  try {
    localStorage.removeItem('uk-tax-calculator-errors');
  } catch (e) {
    // Silent fail
  }
}
