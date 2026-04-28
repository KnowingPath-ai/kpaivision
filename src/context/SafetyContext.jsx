import React, { createContext, useContext, useReducer, useRef, useCallback } from 'react';
import { TrackerStore } from '../services/Tracker/TrackerStore';
import { checkRepeatedPresence } from '../services/Tracker/RepeatedPresenceLogic';
import { loadSafetyConfig, saveSafetyConfig } from '../services/Tracker/thresholds';

const SafetyContext = createContext(null);

const initialState = {
  activeTracks: [],
  lastRepeatedPresenceEvent: null,
  smolvlmAlertText: null,
  isMonitoring: false,
  errorState: null,
  config: loadSafetyConfig(),
};

function safetyReducer(state, action) {
  switch (action.type) {
    case 'SET_TRACKS':
      return { ...state, activeTracks: action.tracks };
    case 'SET_REPEATED_PRESENCE':
      return { ...state, lastRepeatedPresenceEvent: action.event };
    case 'SET_ALERT':
      return { ...state, smolvlmAlertText: action.text };
    case 'CLEAR_ALERT':
      return { ...state, smolvlmAlertText: null, lastRepeatedPresenceEvent: null };
    case 'SET_MONITORING':
      return { ...state, isMonitoring: action.enabled };
    case 'SET_ERROR':
      return { ...state, errorState: action.error };
    case 'UPDATE_CONFIG':
      saveSafetyConfig(action.config);
      return { ...state, config: action.config };
    default:
      return state;
  }
}

export function SafetyProvider({ children }) {
  const [state, dispatch] = useReducer(safetyReducer, initialState);
  const trackerRef = useRef(new TrackerStore());

  const registerDetections = useCallback((detections, frame) => {
    const store = trackerRef.current;
    const now = Date.now();
    store.updateTracks(detections, now);
    store.pruneExpiredTracks(state.config.INACTIVITY_THRESHOLD_MS);
    const tracks = store.getActiveTracks();
    dispatch({ type: 'SET_TRACKS', tracks });

    for (const track of tracks) {
      const result = checkRepeatedPresence({ track, currentTime: now, config: state.config });
      if (result.isTriggered) {
        track.lastAlertTriggered = now;
        dispatch({
          type: 'SET_REPEATED_PRESENCE',
          event: {
            trackId: track.id,
            durationMs: now - track.firstSeen,
            frameCount: track.seenCount,
            confidence: result.confidence,
            lastPosition: track.positions[track.positions.length - 1],
            snapshotFrame: frame,
            timestamp: now,
          },
        });
        break;
      }
    }
  }, [state.config]);

  const acknowledgeAlert = useCallback(() => dispatch({ type: 'CLEAR_ALERT' }), []);

  const clearTracks = useCallback(() => {
    trackerRef.current.reset();
    dispatch({ type: 'SET_TRACKS', tracks: [] });
    dispatch({ type: 'CLEAR_ALERT' });
  }, []);

  const setMonitoring = useCallback((enabled) => dispatch({ type: 'SET_MONITORING', enabled }), []);

  const setAlert = useCallback((text) => dispatch({ type: 'SET_ALERT', text }), []);

  const setError = useCallback((error) => dispatch({ type: 'SET_ERROR', error }), []);

  const updateConfig = useCallback((config) => dispatch({ type: 'UPDATE_CONFIG', config }), []);

  return (
    <SafetyContext.Provider value={{
      state,
      registerDetections,
      acknowledgeAlert,
      clearTracks,
      setMonitoring,
      setAlert,
      setError,
      updateConfig,
    }}>
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error('useSafety must be used within SafetyProvider');
  return ctx;
}
