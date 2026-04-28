import { useEffect, useRef } from 'react';
import { useSafety } from '../context/SafetyContext';
import { useSmolVLMModel } from '../context/SmolVLMModelContext';
import { generateSafetyAlert } from '../services/SmolVLM/SmolVLMClient';

export function useSmolVLMAlerts() {
  const { state, setAlert, setMonitoring } = useSafety();
  const { modelRef, processorRef, ensureLoaded } = useSmolVLMModel();
  const processingRef = useRef(false);

  useEffect(() => {
    const event = state.lastRepeatedPresenceEvent;
    if (!event || processingRef.current) return;
    if (!event.snapshotFrame) return;

    processingRef.current = true;

    (async () => {
      try {
        // Attempt to ensure SmolVLM is loaded (no-op if already loaded or WebGPU unavailable)
        await ensureLoaded();

        const durationMinutes = event.durationMs / 60000;
        const alertText = await generateSafetyAlert({
          modelRef,
          processorRef,
          snapshotBlob: event.snapshotFrame,
          durationMinutes,
          frameCount: event.frameCount,
        });
        setAlert(alertText);
      } catch (err) {
        console.warn('useSmolVLMAlerts error:', err.message);
        setAlert(
          'Someone appears to have been present multiple times recently. Please check your surroundings.'
        );
      } finally {
        processingRef.current = false;
      }
    })();
  }, [state.lastRepeatedPresenceEvent, modelRef, processorRef, ensureLoaded, setAlert, setMonitoring]);
}
