import { render, screen } from '@testing-library/react';
import App from './App';

// SmolVLMModelContext calls ensureLoaded() on mount — mock navigator.gpu to prevent WebGPU call
beforeEach(() => {
  Object.defineProperty(window, 'navigator', {
    value: { ...window.navigator, gpu: undefined, mediaDevices: { getUserMedia: jest.fn() } },
    configurable: true,
  });
});

test('renders Vision Analyzer headline by default', () => {
  render(<App />);
  expect(screen.getByText(/privacy-first vision ai/i)).toBeInTheDocument();
});

test('renders Safety Monitor navigation button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /safety monitor/i })).toBeInTheDocument();
});

test('renders About navigation button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument();
});
