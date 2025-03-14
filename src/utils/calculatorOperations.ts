import { Decimal } from 'decimal.js';
import { debugTax } from './debug';

// Configure Decimal.js for financial calculations
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21,
});

/**
 * Evaluates a mathematical expression string
 * @param expression The expression to evaluate
 * @returns The calculated result
 */
export function evaluateExpression(expression: string): string {
  try {
    // Remove all whitespace
    const cleanExpression = expression.replace(/\s/g, '');

    // Validate expression
    if (!isValidExpression(cleanExpression)) {
      throw new Error('Invalid expression');
    }

    // Convert expression to postfix notation
    const postfix = infixToPostfix(cleanExpression);

    // Evaluate postfix expression
    const result = evaluatePostfix(postfix);

    // Format result
    return formatNumber(result);
  } catch (error) {
    debugTax('Expression evaluation error:', error);
    throw new Error('Invalid calculation');
  }
}

/**
 * Formats a number for display
 * @param num The number to format
 * @returns Formatted string
 */
export function formatNumber(num: number | string): string {
  try {
    const decimal = new Decimal(num);
    // If it's a whole number, return without decimals
    if (decimal.isInteger()) {
      return decimal.toString();
    }
    // Otherwise show up to 8 decimal places, with trailing zeros removed
    return decimal.toFixed(8).replace(/\.?0+$/, '');
  } catch (error) {
    debugTax('Number formatting error:', error);
    return '0';
  }
}

/**
 * Validates a mathematical expression
 * @param expression The expression to validate
 * @returns True if valid
 */
function isValidExpression(expression: string): boolean {
  // Check for valid characters
  if (!/^[\d+\-*/.()]+$/.test(expression)) {
    return false;
  }

  // Check balanced parentheses
  let parentheses = 0;
  let lastChar = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    // Check for consecutive operators (except minus for negative numbers)
    if (/[+\-*\/]/.test(char) && /[+*\/]/.test(lastChar)) {
      return false;
    }

    // Check for empty parentheses
    if (char === '(' && expression[i + 1] === ')') {
      return false;
    }

    // Count parentheses
    if (char === '(') parentheses++;
    if (char === ')') parentheses--;

    // If at any point we have more closing than opening parentheses, it's invalid
    if (parentheses < 0) return false;

    lastChar = char;
  }

  // If we don't have the same number of opening and closing parentheses
  if (parentheses !== 0) return false;

  // Check if expression ends with an operator
  if (/[+\-*\/]/.test(expression[expression.length - 1])) {
    return false;
  }

  return true;
}

/**
 * Converts infix expression to postfix notation
 * @param expression The infix expression
 * @returns Postfix expression array
 */
function infixToPostfix(expression: string): string[] {
  const output: string[] = [];
  const operators: string[] = [];
  let number = '';

  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    // Handle numbers and decimal points
    if (/\d|\./.test(char)) {
      number += char;
    } else {
      if (number) {
        output.push(number);
        number = '';
      }

      // Handle operators and parentheses
      if (char === '(') {
        operators.push(char);
      } else if (char === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          output.push(operators.pop()!);
        }
        operators.pop(); // Remove the '('
      } else {
        // Handle operators with precedence
        while (
          operators.length &&
          operators[operators.length - 1] !== '(' &&
          precedence[operators[operators.length - 1]] >= precedence[char]
        ) {
          output.push(operators.pop()!);
        }
        operators.push(char);
      }
    }
  }

  // Handle any remaining number
  if (number) {
    output.push(number);
  }

  // Add remaining operators
  while (operators.length) {
    output.push(operators.pop()!);
  }

  return output;
}

/**
 * Evaluates a postfix expression
 * @param postfix The postfix expression array
 * @returns Calculated result
 */
function evaluatePostfix(postfix: string[]): number {
  const stack: Decimal[] = [];

  for (const token of postfix) {
    if (/[\d.]/.test(token)) {
      stack.push(new Decimal(token));
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (token) {
        case '+':
          stack.push(a.plus(b));
          break;
        case '-':
          stack.push(a.minus(b));
          break;
        case '*':
          stack.push(a.times(b));
          break;
        case '/':
          if (b.isZero()) {
            throw new Error('Division by zero');
          }
          stack.push(a.dividedBy(b));
          break;
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return Number(stack[0]);
}

/**
 * Performs a basic calculation between two numbers
 * @param a First number
 * @param b Second number
 * @param operator Arithmetic operator (+, -, *, /)
 * @returns The calculated result
 */
export function calculate(a: number, b: number, operator: string): number {
  const numA = new Decimal(a);
  const numB = new Decimal(b);

  switch (operator) {
    case '+':
      return Number(numA.plus(numB));
    case '-':
      return Number(numA.minus(numB));
    case '*':
      return Number(numA.times(numB));
    case '/':
      if (numB.isZero()) throw new Error('Division by zero');
      return Number(numA.dividedBy(numB));
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}
