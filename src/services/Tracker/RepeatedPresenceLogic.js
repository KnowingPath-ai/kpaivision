import { DEFAULT_TRACKER_CONFIG } from './thresholds';

export function checkRepeatedPresence({ track, currentTime, config = DEFAULT_TRACKER_CONFIG }) {
  const duration = currentTime - track.firstSeen;

  if (duration < config.MIN_DURATION_MS) {
    return { isTriggered: false, reason: 'Below minimum duration' };
  }

  if (track.seenCount < config.MIN_FRAME_COUNT) {
    return { isTriggered: false, reason: 'Below minimum frame count' };
  }

  if (track.lastAlertTriggered) {
    const cooldownElapsed = currentTime - track.lastAlertTriggered;
    if (cooldownElapsed < config.ALERT_COOLDOWN_MS) {
      return { isTriggered: false, reason: 'Cooldown active' };
    }
  }

  const confidence = calculateConfidence(track, duration);

  return {
    isTriggered: true,
    reason: `Track seen ${track.seenCount} times over ${Math.round(duration / 60000)} min`,
    confidence,
  };
}

function calculateConfidence(track, duration) {
  const durationScore = Math.min(duration / (30 * 60 * 1000), 1);
  const frameScore = Math.min(track.seenCount / 50, 1);
  return parseFloat(((durationScore + frameScore) / 2).toFixed(3));
}
