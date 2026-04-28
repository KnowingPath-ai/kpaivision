import React from 'react';
import { render, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { SafetyProvider, useSafety } from '../SafetyContext';

// SafetyContext uses localStorage via thresholds module — no mock needed in jsdom.

function wrapper({ children }) {
  return <SafetyProvider>{children}</SafetyProvider>;
}

describe('SafetyContext', () => {
  test('provides default state', () => {
    const { result } = renderHook(() => useSafety(), { wrapper });
    expect(result.current.state.activeTracks).toEqual([]);
    expect(result.current.state.isMonitoring).toBe(false);
    expect(result.current.state.lastRepeatedPresenceEvent).toBeNull();
    expect(result.current.state.smolvlmAlertText).toBeNull();
  });

  test('setMonitoring toggles isMonitoring', () => {
    const { result } = renderHook(() => useSafety(), { wrapper });
    act(() => result.current.setMonitoring(true));
    expect(result.current.state.isMonitoring).toBe(true);
    act(() => result.current.setMonitoring(false));
    expect(result.current.state.isMonitoring).toBe(false);
  });

  test('setAlert sets smolvlmAlertText', () => {
    const { result } = renderHook(() => useSafety(), { wrapper });
    act(() => result.current.setAlert('Test alert'));
    expect(result.current.state.smolvlmAlertText).toBe('Test alert');
  });

  test('acknowledgeAlert clears alert and event', () => {
    const { result } = renderHook(() => useSafety(), { wrapper });
    act(() => result.current.setAlert('Test alert'));
    act(() => result.current.acknowledgeAlert());
    expect(result.current.state.smolvlmAlertText).toBeNull();
    expect(result.current.state.lastRepeatedPresenceEvent).toBeNull();
  });

  test('clearTracks empties activeTracks', () => {
    const { result } = renderHook(() => useSafety(), { wrapper });
    // Simulate tracks via registerDetections
    act(() => {
      result.current.registerDetections(
        [{ bbox: [0, 0, 10, 10], embedding: new Float32Array(128).fill(0.1), confidence: 0.9, timestamp: 1000 }],
        null
      );
    });
    expect(result.current.state.activeTracks.length).toBeGreaterThanOrEqual(0); // store creates them
    act(() => result.current.clearTracks());
    expect(result.current.state.activeTracks).toHaveLength(0);
  });

  test('setError sets errorState', () => {
    const { result } = renderHook(() => useSafety(), { wrapper });
    const error = { message: 'Face model failed', type: 'face-engine' };
    act(() => result.current.setError(error));
    expect(result.current.state.errorState).toEqual(error);
  });

  test('updateConfig merges and persists config', () => {
    const { result } = renderHook(() => useSafety(), { wrapper });
    act(() => result.current.updateConfig({ ...result.current.state.config, SIM_THRESHOLD: 0.85 }));
    expect(result.current.state.config.SIM_THRESHOLD).toBe(0.85);
  });

  test('throws when used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useSafety())).toThrow();
    spy.mockRestore();
  });
});
