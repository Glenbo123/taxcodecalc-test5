import { useState } from 'react';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AIChat } from './AIChat';

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-govuk-blue text-white p-3 rounded-full shadow-lg hover:bg-govuk-blue/90 transition-colors"
        aria-label="Open help chat"
      >
        <QuestionMarkCircleIcon className="h-6 w-6" />
      </button>

      <AIChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default HelpButton;
