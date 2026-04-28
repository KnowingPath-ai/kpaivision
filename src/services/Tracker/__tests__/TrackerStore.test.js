import { TrackerStore } from '../TrackerStore';

const DEFAULT_CONFIG = {
  SIM_THRESHOLD: 0.75,
  MIN_EMBEDDINGS_FOR_MATCH: 2,
  TRACK_WINDOW_MS: 15 * 60 * 1000,
  INACTIVITY_THRESHOLD_MS: 5 * 60 * 1000,
  MAX_POSITION_HISTORY: 50,
  MIN_DURATION_MS: 5 * 60 * 1000,
  MIN_FRAME_COUNT: 5,
  ALERT_COOLDOWN_MS: 5 * 60 * 1000,
};

function makeDetection(embeddingValues = [1, 0, 0, 0]) {
  return {
    bbox: [100, 100, 50, 50],
    embedding: new Float32Array(embeddingValues.concat(new Array(128 - embeddingValues.length).fill(0))),
    confidence: 0.9,
    timestamp: Date.now(),
  };
}

describe('TrackerStore', () => {
  let store;

  beforeEach(() => {
    store = new TrackerStore(DEFAULT_CONFIG);
  });

  describe('updateTracks()', () => {
    test('creates new track for first detection', () => {
      store.updateTracks([makeDetection([1, 0])], 1000);
      expect(store.getActiveTracks()).toHaveLength(1);
      const track = store.getActiveTracks()[0];
      expect(track.seenCount).toBe(1);
      expect(typeof track.id).toBe('string');
      expect(track.firstSeen).toBe(1000);
    });

    test('matches similar detection to existing track', () => {
      const det1 = makeDetection([1, 0, 0, 0]);
      const det2 = makeDetection([0.999, 0.001, 0, 0]); // very similar
      store.updateTracks([det1], 1000);
      store.updateTracks([det2], 2000);
      expect(store.getActiveTracks()).toHaveLength(1);
      expect(store.getActiveTracks()[0].seenCount).toBe(2);
    });

    test('creates separate track for dissimilar detection', () => {
      const det1 = makeDetection([1, 0, 0, 0]);
      const det2 = makeDetection([0, 1, 0, 0]); // orthogonal = 0 similarity
      store.updateTracks([det1], 1000);
      store.updateTracks([det2], 2000);
      expect(store.getActiveTracks()).toHaveLength(2);
    });

    test('updates embeddingAvg with EMA', () => {
      const det1 = makeDetection([1, 0]);
      const det2 = makeDetection([1, 0]);
      store.updateTracks([det1], 1000);
      store.updateTracks([det2], 2000);
      const track = store.getActiveTracks()[0];
      // EMA: 0.7 * 1 + 0.3 * 1 = 1 (same input)
      expect(track.embeddingAvg[0]).toBeCloseTo(1.0);
    });

    test('updates position list', () => {
      store.updateTracks([makeDetection()], 1000);
      const track = store.getActiveTracks()[0];
      // bbox [100, 100, 50, 50] → center = [125, 125]
      expect(track.positions).toHaveLength(1);
      expect(track.positions[0]).toEqual([125, 125]);
    });

    test('handles empty detection array gracefully', () => {
      store.updateTracks([], 1000);
      expect(store.getActiveTracks()).toHaveLength(0);
    });

    test('caps position history at MAX_POSITION_HISTORY', () => {
      const det = makeDetection([1, 0]);
      for (let i = 0; i < 60; i++) {
        store.updateTracks([det], 1000 + i * 100);
      }
      const track = store.getActiveTracks()[0];
      expect(track.positions.length).toBeLessThanOrEqual(DEFAULT_CONFIG.MAX_POSITION_HISTORY);
    });

    test('updates lastSeen on each match', () => {
      const det = makeDetection([1, 0]);
      store.updateTracks([det], 1000);
      store.updateTracks([det], 9000);
      expect(store.getActiveTracks()[0].lastSeen).toBe(9000);
    });
  });

  describe('pruneExpiredTracks()', () => {
    test('removes tracks inactive longer than maxAgeMs', () => {
      store.updateTracks([makeDetection()], 0);
      // Simulate 6 minutes passing (above 5-min threshold)
      // We'll manipulate lastSeen directly
      const track = store.getActiveTracks()[0];
      track.lastSeen = Date.now() - 6 * 60 * 1000;
      store.pruneExpiredTracks(5 * 60 * 1000);
      expect(store.getActiveTracks()).toHaveLength(0);
    });

    test('keeps tracks within maxAgeMs', () => {
      store.updateTracks([makeDetection()], Date.now() - 1000);
      store.pruneExpiredTracks(5 * 60 * 1000);
      expect(store.getActiveTracks()).toHaveLength(1);
    });
  });

  describe('getActiveTracks()', () => {
    test('returns empty array when no tracks', () => {
      expect(store.getActiveTracks()).toEqual([]);
    });

    test('returns all active tracks', () => {
      store.updateTracks([makeDetection([1, 0])], 1000);
      store.updateTracks([makeDetection([0, 1])], 1000);
      expect(store.getActiveTracks()).toHaveLength(2);
    });
  });

  describe('reset()', () => {
    test('clears all tracks', () => {
      store.updateTracks([makeDetection()], 1000);
      store.reset();
      expect(store.getActiveTracks()).toHaveLength(0);
    });
  });

  describe('getStats()', () => {
    test('returns correct trackCount', () => {
      store.updateTracks([makeDetection([1, 0])], 1000);
      store.updateTracks([makeDetection([0, 1])], 1000);
      expect(store.getStats().trackCount).toBe(2);
    });

    test('returns 0 oldestTrackMs when no tracks', () => {
      expect(store.getStats().oldestTrackMs).toBe(0);
    });

    test('returns positive oldestTrackMs when tracks exist', () => {
      store.updateTracks([makeDetection()], Date.now() - 5000);
      expect(store.getStats().oldestTrackMs).toBeGreaterThan(4000);
    });
  });
});
