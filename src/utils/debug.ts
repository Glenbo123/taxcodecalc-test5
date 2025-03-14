import debug from 'debug';

// Create debuggers for different parts of the application
export const debugTax = debug('tax:calculations');
export const debugUI = debug('ui:components');
export const debugAPI = debug('api:requests');
export const debugRouter = debug('router:navigation');
export const debugState = debug('state:changes');
export const debugPerf = debug('performance');

// Enable debugging in development
if (process.env.NODE_ENV === 'development') {
  debug.enable('tax:*,ui:*,api:*,router:*,state:*,performance:*');
}

// Helper function to safely stringify objects for logging
export function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return `[Error stringifying object: ${error}]`;
  }
}

// Performance monitoring
export function measurePerformance(label: string, fn: () => void): void {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    fn();
    const end = performance.now();
    debugPerf(`${label}: ${(end - start).toFixed(2)}ms`);
  } else {
    fn();
  }
}

// Error tracking
export function logError(
  error: Error,
  context?: Record<string, unknown>
): void {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context: context ? safeStringify(context) : undefined,
    timestamp: new Date().toISOString(),
  };

  debug('error')('Error occurred:', errorInfo);

  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', errorInfo);
  }
}

// Memory usage tracking
export function logMemoryUsage(): void {
  if (process.env.NODE_ENV === 'development') {
    // Check if memory property exists (Chrome-specific)
    const memory = (performance as any).memory;
    if (memory) {
      debugPerf('Memory usage:', {
        usedJSHeapSize: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(
          2
        )} MB`,
        jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(
          2
        )} MB`,
      });
    } else {
      debugPerf('Memory usage information not available in this browser');
    }
  }
}

// Network request tracking
export function logRequest(method: string, url: string, data?: unknown): void {
  debugAPI('Request:', {
    method,
    url,
    data: data ? safeStringify(data) : undefined,
    timestamp: new Date().toISOString(),
  });
}

// Network response tracking
export function logResponse(
  method: string,
  url: string,
  status: number,
  data?: unknown
): void {
  debugAPI('Response:', {
    method,
    url,
    status,
    data: data ? safeStringify(data) : undefined,
    timestamp: new Date().toISOString(),
  });
}
