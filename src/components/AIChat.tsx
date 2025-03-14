import { useState, useRef, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CustomButton } from './CustomButton';
import { TextArea } from './Input';
import DOMPurify from 'dompurify';
import { logError } from '../utils/errorLogger';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "Hello! I'm your HMRC Tax Calculator assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus the input field when the chat opens
  useEffect(() => {
    if (isOpen) {
      // Use a short timeout to ensure the dialog is fully rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Sanitize user input
    const sanitizedInput = DOMPurify.sanitize(input.trim());

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: sanitizedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Simulate AI response
      const timer = setTimeout(() => {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          type: 'assistant',
          content: getAIResponse(sanitizedInput),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);

        // Announce new message to screen readers
        const announcement = document.getElementById('ai-chat-announcement');
        if (announcement) {
          announcement.textContent = 'New message received';
        }
      }, 1000);

      // Clean up timeout if component unmounts
      return () => clearTimeout(timer);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error in AI Chat'), {
        component: 'AIChat',
        operation: 'getResponse',
      });

      // Show error message to user
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content:
          "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-[80]"
      aria-labelledby="chat-dialog-title"
    >
      {/* Accessibility announcement for screen readers */}
      <div
        id="ai-chat-announcement"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      ></div>

      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex flex-col h-[600px] max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-govuk-blue/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-govuk-blue"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path
                      d="M12 16v-4M12 8h.01"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h2
                    id="chat-dialog-title"
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    AI Assistant
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    HMRC Tax Calculator Help
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Close chat"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
              aria-label="Chat messages"
              role="log"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-govuk-blue text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                    role={message.type === 'assistant' ? 'status' : undefined}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
                    aria-label="Assistant is typing"
                  >
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <TextArea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[44px] max-h-32"
                  rows={1}
                  aria-label="Message input"
                />
                <CustomButton
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  icon={<PaperAirplaneIcon className="h-5 w-5" />}
                  aria-label="Send message"
                >
                  Send
                </CustomButton>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Simple response system - in a real application, this would be connected to a proper AI backend
function getAIResponse(input: string): string {
  const normalizedInput = input.toLowerCase();

  if (normalizedInput.includes('tax code')) {
    return 'Your tax code determines your tax-free Personal Allowance. The most common code is 1257L, which means you can earn £12,570 before paying tax. You can find your tax code on your payslip or by contacting HMRC.';
  }

  if (normalizedInput.includes('national insurance')) {
    return "National Insurance contributions are paid on your earnings if you're employed or self-employed. The main rate is 12% on earnings between £1,048 and £4,189 per month, and 2% on earnings above £4,189.";
  }

  if (normalizedInput.includes('pension')) {
    return 'Pension contributions can reduce your taxable income. Money paid into your pension from your salary is usually taken before tax is calculated, meaning you get tax relief at your highest rate of tax.';
  }

  if (
    normalizedInput.includes('salary') ||
    normalizedInput.includes('income')
  ) {
    return 'Enter your salary in the calculator to see a detailed breakdown of your tax and take-home pay. You can enter annual, monthly, weekly, or hourly amounts. The calculator will show you Income Tax, National Insurance, and your net pay.';
  }

  return 'I can help you understand tax calculations, tax codes, National Insurance, and pension contributions. What would you like to know more about?';
}
