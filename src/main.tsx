import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './i18n/config';
import { debugUI } from './utils/debug';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Enable debug logging in development
if (process.env.NODE_ENV === 'development') {
  debugUI('Application starting in development mode');
  localStorage.setItem('debug', '*');
}

// Configure global error handler
function handleGlobalError(event: ErrorEvent) {
  console.error('Global error caught:', event.error);

  // Prevent the browser from showing its own error dialog
  event.preventDefault();
}

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Add global error handlers
window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
