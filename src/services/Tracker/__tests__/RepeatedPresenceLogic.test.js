import { checkRepeatedPresence } from '../RepeatedPresenceLogic';

const DEFAULT_CONFIG = {
  SIM_THRESHOLD: 0.75,
  MIN_DURATION_MS: 5 * 60 * 1000,
  MIN_FRAME_COUNT: 5,
  ALERT_COOLDOWN_MS: 5 * 60 * 1000,
};

function makeTrack(overrides = {}) {
  return {
    id: 'track-test',
    embeddingAvg: new Float32Array([1, 0, 0]),
    firstSeen: 0,
    lastSeen: 10 * 60 * 1000,
    seenCount: 10,
    positions: [[100, 100]],
    status: 'active',
    lastAlertTriggered: null,
    ...overrides,
  };
}

describe('checkRepeatedPresence()', () => {
  test('returns triggered=false below MIN_DURATION_MS', () => {
    const track = makeTrack({ firstSeen: 0, lastSeen: 2 * 60 * 1000, seenCount: 10 });
    const result = checkRepeatedPresence({ track, currentTime: 2 * 60 * 1000, config: DEFAULT_CONFIG });
    expect(result.isTriggered).toBe(false);
    expect(result.reason).toMatch(/duration/i);
  });

  test('returns triggered=false below MIN_FRAME_COUNT', () => {
    const track = makeTrack({ firstSeen: 0, lastSeen: 10 * 60 * 1000, seenCount: 2 });
    const result = checkRepeatedPresence({ track, currentTime: 10 * 60 * 1000, config: DEFAULT_CONFIG });
    expect(result.isTriggered).toBe(false);
    expect(result.reason).toMatch(/frame/i);
  });

  test('triggers when both thresholds are met', () => {
    const track = makeTrack({ firstSeen: 0, lastSeen: 10 * 60 * 1000, seenCount: 10 });
    const result = checkRepeatedPresence({ track, currentTime: 10 * 60 * 1000, config: DEFAULT_CONFIG });
    expect(result.isTriggered).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  test('respects cooldown — does not re-trigger within cooldown window', () => {
    const now = 10 * 60 * 1000;
    const track = makeTrack({
      firstSeen: 0,
      lastSeen: now,
      seenCount: 20,
      lastAlertTriggered: now - 3 * 60 * 1000, // alerted 3 min ago (cooldown 5 min)
    });
    const result = checkRepeatedPresence({ track, currentTime: now, config: DEFAULT_CONFIG });
    expect(result.isTriggered).toBe(false);
    expect(result.reason).toMatch(/cooldown/i);
  });

  test('re-triggers after cooldown expires', () => {
    const now = 20 * 60 * 1000;
    const track = makeTrack({
      firstSeen: 0,
      lastSeen: now,
      seenCount: 20,
      lastAlertTriggered: now - 6 * 60 * 1000, // alerted 6 min ago (cooldown 5 min) → expired
    });
    const result = checkRepeatedPresence({ track, currentTime: now, config: DEFAULT_CONFIG });
    expect(result.isTriggered).toBe(true);
  });

  test('higher seenCount and duration produce higher confidence', () => {
    const highConf = makeTrack({ firstSeen: 0, lastSeen: 30 * 60 * 1000, seenCount: 50 });
    const lowConf = makeTrack({ firstSeen: 0, lastSeen: 5.1 * 60 * 1000, seenCount: 5 });
    const r1 = checkRepeatedPresence({ track: highConf, currentTime: 30 * 60 * 1000, config: DEFAULT_CONFIG });
    const r2 = checkRepeatedPresence({ track: lowConf, currentTime: 5.1 * 60 * 1000, config: DEFAULT_CONFIG });
    expect(r1.confidence).toBeGreaterThan(r2.confidence);
  });

  test('confidence is between 0 and 1', () => {
    const track = makeTrack();
    const result = checkRepeatedPresence({ track, currentTime: 10 * 60 * 1000, config: DEFAULT_CONFIG });
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  test('works with null lastAlertTriggered', () => {
    const track = makeTrack({ lastAlertTriggered: null });
    const result = checkRepeatedPresence({ track, currentTime: 10 * 60 * 1000, config: DEFAULT_CONFIG });
    expect(result.isTriggered).toBe(true);
  });

  test('reason string describes track state', () => {
    const track = makeTrack({ seenCount: 15 });
    const result = checkRepeatedPresence({ track, currentTime: 10 * 60 * 1000, config: DEFAULT_CONFIG });
    expect(result.reason).toContain('15');
  });
});
