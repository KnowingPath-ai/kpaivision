const STORAGE_KEY = 'safety-config';

export const DEFAULT_TRACKER_CONFIG = {
  SIM_THRESHOLD: 0.75,
  MIN_EMBEDDINGS_FOR_MATCH: 2,
  TRACK_WINDOW_MS: 15 * 60 * 1000,       // 15 minutes
  INACTIVITY_THRESHOLD_MS: 5 * 60 * 1000, // 5 minutes
  MAX_POSITION_HISTORY: 50,
  MIN_DURATION_MS: 5 * 60 * 1000,         // 5 minutes
  MIN_FRAME_COUNT: 5,
  ALERT_COOLDOWN_MS: 5 * 60 * 1000,       // 5 minutes
};

export function loadSafetyConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_TRACKER_CONFIG, ...JSON.parse(stored) };
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_TRACKER_CONFIG };
}

export function saveSafetyConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore storage errors
  }
}
