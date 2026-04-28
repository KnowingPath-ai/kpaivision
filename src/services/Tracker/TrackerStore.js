import { cosineSimilarity } from '../../utils/similarity';
import { DEFAULT_TRACKER_CONFIG } from './thresholds';

export class TrackerStore {
  constructor(config = DEFAULT_TRACKER_CONFIG) {
    this.config = config;
    this.tracks = new Map();
  }

  updateTracks(detections, timestamp) {
    if (!detections || detections.length === 0) return;
    const activeTracks = this.getActiveTracks();

    for (const detection of detections) {
      let bestTrack = null;
      let bestSim = -Infinity;

      for (const track of activeTracks) {
        const sim = cosineSimilarity(track.embeddingAvg, detection.embedding);
        if (sim > bestSim) {
          bestSim = sim;
          bestTrack = track;
        }
      }

      if (bestTrack && bestSim >= this.config.SIM_THRESHOLD) {
        this._updateTrack(bestTrack, detection, timestamp);
      } else {
        this._createTrack(detection, timestamp);
      }
    }
  }

  _createTrack(detection, timestamp) {
    const id = crypto.randomUUID ? crypto.randomUUID() : `track-${Date.now()}-${Math.random()}`;
    const track = {
      id,
      embeddingAvg: new Float32Array(detection.embedding),
      firstSeen: timestamp,
      lastSeen: timestamp,
      seenCount: 1,
      positions: [this._center(detection.bbox)],
      status: 'active',
      lastAlertTriggered: null,
    };
    this.tracks.set(id, track);
    return track;
  }

  _updateTrack(track, detection, timestamp) {
    const alpha = 0.3; // weight for new observation
    const emb = track.embeddingAvg;
    const newEmb = new Float32Array(emb.length);
    for (let i = 0; i < emb.length; i++) {
      newEmb[i] = (1 - alpha) * emb[i] + alpha * detection.embedding[i];
    }
    track.embeddingAvg = newEmb;
    track.lastSeen = timestamp;
    track.seenCount += 1;
    track.positions.push(this._center(detection.bbox));
    if (track.positions.length > this.config.MAX_POSITION_HISTORY) {
      track.positions.shift();
    }
  }

  _center(bbox) {
    return [Math.round(bbox[0] + bbox[2] / 2), Math.round(bbox[1] + bbox[3] / 2)];
  }

  pruneExpiredTracks(maxAgeMs) {
    const now = Date.now();
    for (const [id, track] of this.tracks) {
      if (now - track.lastSeen > maxAgeMs) {
        this.tracks.delete(id);
      }
    }
  }

  getActiveTracks() {
    return Array.from(this.tracks.values()).filter((t) => t.status === 'active');
  }

  reset() {
    this.tracks.clear();
  }

  getStats() {
    const tracks = Array.from(this.tracks.values());
    const now = Date.now();
    const oldest = tracks.reduce((min, t) => Math.min(min, t.firstSeen), now);
    return {
      trackCount: tracks.length,
      oldestTrackMs: tracks.length > 0 ? now - oldest : 0,
    };
  }
}
