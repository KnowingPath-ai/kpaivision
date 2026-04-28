import { useState, useRef, useCallback, useEffect } from 'react';
import { useSafety } from '../context/SafetyContext';
import { initFaceEngine, isFaceEngineReady, detectFaces } from '../services/FaceEngine';
import { useSmolVLMAlerts } from './useSmolVLMAlerts';

export function useSafetyLoop() {
  const { state, registerDetections, setMonitoring, setError } = useSafety();
  const [engineReady, setEngineReady] = useState(false);
  const [engineError, setEngineError] = useState(null);
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastFpsRef = useRef(Date.now());
  const videoCaptureRef = useRef(null);

  // Wire SmolVLM alerts (reacts to lastRepeatedPresenceEvent in context)
  useSmolVLMAlerts();

  // Initialize FaceEngine when monitoring starts
  useEffect(() => {
    if (!state.isMonitoring || engineReady) return;
    let cancelled = false;

    initFaceEngine()
      .then(() => { if (!cancelled) setEngineReady(true); })
      .catch((err) => {
        if (!cancelled) {
          setEngineError(err.message);
          setError({ message: err.message, type: 'face-engine' });
        }
      });

    return () => { cancelled = true; };
  }, [state.isMonitoring, engineReady, setError]);

  const processFrame = useCallback(async (videoElement) => {
    if (!videoElement || !isFaceEngineReady()) return;

    try {
      const detections = await detectFaces(videoElement);

      // Capture snapshot only when we have detections (needed for SmolVLM alert later)
      let snapshotBlob = null;
      if (detections.length > 0 && videoCaptureRef.current) {
        snapshotBlob = await videoCaptureRef.current.captureSnapshot();
      }

      registerDetections(detections, snapshotBlob);

      // Update FPS counter
      frameCountRef.current += 1;
      const now = Date.now();
      const elapsed = now - lastFpsRef.current;
      if (elapsed >= 2000) {
        setFps(frameCountRef.current / (elapsed / 1000));
        frameCountRef.current = 0;
        lastFpsRef.current = now;
      }
    } catch (err) {
      console.warn('useSafetyLoop frame error:', err.message);
    }
  }, [registerDetections]);

  return { processFrame, engineReady, engineError, fps, videoCaptureRef, setMonitoring };
}
