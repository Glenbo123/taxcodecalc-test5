import { useState, lazy, Suspense } from 'react';
import { ComputerDesktopIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ChatWindow = lazy(() =>
  import('./ChatWindow').then((module) => ({ default: module.ChatWindow }))
);

export function WebChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[70] bg-govuk-blue hover:bg-govuk-blue/90 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        aria-label="Open chat"
      >
        <ComputerDesktopIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <Suspense
          fallback={
            <div className="fixed bottom-20 right-4 z-[71] w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
              Loading chat...
            </div>
          }
        >
          <div className="fixed bottom-20 right-4 z-[71] w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Chat Support
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <ChatWindow />
          </div>
        </Suspense>
      )}
    </>
  );
}
