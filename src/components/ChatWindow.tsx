import { useState, useRef, useEffect } from 'react';
import { TextArea } from './Input';
import { CustomButton } from './CustomButton';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import DOMPurify from 'dompurify';
import { logError } from '../utils/errorLogger';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your HMRC assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      setTimeout(() => {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          type: 'assistant',
          content: getSimpleResponse(sanitizedInput),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Chat error'), {
        component: 'ChatWindow',
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
    <div className="flex flex-col h-80">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 min-h-[44px] max-h-32"
            rows={1}
          />
          <CustomButton
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            icon={<PaperAirplaneIcon className="h-5 w-5" />}
          >
            Send
          </CustomButton>
        </div>
      </div>
    </div>
  );
}

function getSimpleResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('tax code')) {
    return 'Your tax code determines your tax-free Personal Allowance. The most common code is 1257L, which means you can earn £12,570 before paying tax.';
  }

  if (lowerInput.includes('national insurance')) {
    return "National Insurance contributions are paid on your earnings if you're employed or self-employed. The main rate is 8% for the 2024/25 tax year.";
  }

  if (lowerInput.includes('salary') || lowerInput.includes('pay')) {
    return 'You can calculate your take-home pay by entering your salary in our calculator. This will show a breakdown of taxes and National Insurance.';
  }

  return 'I can help with tax-related questions about PAYE, National Insurance, and tax codes. What would you like to know more about?';
}

export default ChatWindow;
