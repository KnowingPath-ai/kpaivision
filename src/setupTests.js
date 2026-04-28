// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill crypto.randomUUID for jsdom (required by TrackerStore)
if (!globalThis.crypto) {
  globalThis.crypto = {};
}
if (typeof globalThis.crypto.randomUUID !== 'function') {
  let counter = 0;
  globalThis.crypto.randomUUID = () => `test-uuid-${++counter}-${Date.now()}`;
}
