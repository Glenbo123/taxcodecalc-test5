// Setup file for Vitest

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with testing-library methods
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock global objects that might be missing in test environment
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Mock matchMedia if it doesn't exist
if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  });
}

// Define global Jest object to avoid "jest is not defined" errors
global.jest = {
  fn: vi.fn,
  mock: vi.mock
};