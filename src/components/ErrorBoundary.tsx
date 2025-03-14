import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);

    // You could also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md text-center max-w-lg w-full">
            <h2 className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The application encountered an unexpected error. Please try
              refreshing the page.
            </p>
            {this.state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-6 text-left overflow-auto max-h-36">
                <p className="text-sm font-mono text-red-800 dark:text-red-300">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-govuk-blue text-white rounded-md hover:bg-govuk-blue/90 focus:outline-none focus:ring-2 focus:ring-govuk-blue focus:ring-offset-2"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
