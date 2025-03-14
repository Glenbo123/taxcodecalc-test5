import { ErrorSeverity } from '../utils/errorLogger';

export interface CalculationError extends Error {
  code: string;
  context: Record<string, unknown>;
  severity: ErrorSeverity;
}

export class TaxCalculationError extends Error implements CalculationError {
  code: string;
  context: Record<string, unknown>;
  severity: ErrorSeverity;

  constructor(
    message: string,
    code: string,
    context: Record<string, unknown>,
    severity: ErrorSeverity = ErrorSeverity.ERROR
  ) {
    super(message);
    this.name = 'TaxCalculationError';
    this.code = code;
    this.context = context;
    this.severity = severity;
  }
}

export class ValidationError extends Error implements CalculationError {
  code: string;
  context: Record<string, unknown>;
  severity: ErrorSeverity;

  constructor(message: string, context: Record<string, unknown>) {
    super(message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
    this.context = context;
    this.severity = ErrorSeverity.WARNING;
  }
}
