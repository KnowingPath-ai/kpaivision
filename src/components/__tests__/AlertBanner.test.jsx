import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertBanner from '../SafetyFeature/AlertBanner';

describe('AlertBanner', () => {
  test('renders nothing when message is null', () => {
    const { container } = render(<AlertBanner message={null} onDismiss={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders alert text when message is provided', () => {
    render(<AlertBanner message="Someone has been seen multiple times." onDismiss={jest.fn()} />);
    expect(screen.getByText(/someone has been seen/i)).toBeInTheDocument();
  });

  test('shows "Safety Notice" heading', () => {
    render(<AlertBanner message="Test" onDismiss={jest.fn()} />);
    expect(screen.getByText(/safety notice/i)).toBeInTheDocument();
  });

  test('shows disclaimer text', () => {
    render(<AlertBanner message="Test" onDismiss={jest.fn()} />);
    expect(screen.getByText(/not a definitive judgment/i)).toBeInTheDocument();
  });

  test('calls onDismiss when "Got it" is clicked', async () => {
    const onDismiss = jest.fn();
    render(<AlertBanner message="Test" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: /acknowledge/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('calls onDismiss when close button (✕) is clicked', async () => {
    const onDismiss = jest.fn();
    render(<AlertBanner message="Test" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: /dismiss safety notice/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('auto-dismisses after autoDismissMs', async () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    render(<AlertBanner message="Test" onDismiss={onDismiss} autoDismissMs={1000} />);
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1001));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  test('has role="alert" for screen reader announcement', () => {
    render(<AlertBanner message="Test" onDismiss={jest.fn()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('does not auto-dismiss when message changes to null', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    const { rerender } = render(<AlertBanner message="Test" onDismiss={onDismiss} autoDismissMs={1000} />);
    rerender(<AlertBanner message={null} onDismiss={onDismiss} autoDismissMs={1000} />);
    act(() => jest.advanceTimersByTime(2000));
    // onDismiss should not be called for null message (component renders null)
    expect(onDismiss).not.toHaveBeenCalled();
    jest.useRealTimers();
  });
});
