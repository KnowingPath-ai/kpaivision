import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

const VideoCapture = forwardRef(function VideoCapture(
  { onFrame, frameIntervalMs = 500, width = 640, height = 480, enabled = true },
  ref
) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);

  // Expose captureSnapshot() for SafetyLoop to grab a Blob
  useImperativeHandle(ref, () => ({
    captureSnapshot() {
      const video = videoRef.current;
      if (!video || !isActive) return null;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || width;
      canvas.height = video.videoHeight || height;
      canvas.getContext('2d').drawImage(video, 0, 0);
      return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
    },
    getVideoElement() {
      return videoRef.current;
    },
  }));

  const stopStream = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  const startStream = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: width }, height: { ideal: height }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasPermission(true);
      setIsActive(true);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Click "Enable" and allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera detected. Please connect a camera and try again.');
      } else {
        setError(`Camera error: ${err.message}`);
      }
      setHasPermission(false);
      setIsActive(false);
    }
  }, [width, height]);

  // Frame sampling loop
  useEffect(() => {
    if (!isActive || !onFrame) return;
    timerRef.current = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        onFrame(videoRef.current);
      }
    }, frameIntervalMs);
    return () => clearInterval(timerRef.current);
  }, [isActive, onFrame, frameIntervalMs]);

  // Start/stop when enabled changes
  useEffect(() => {
    if (enabled) {
      startStream();
    } else {
      stopStream();
    }
    return () => stopStream();
  }, [enabled, startStream, stopStream]);

  if (!navigator.mediaDevices?.getUserMedia) {
    return (
      <div style={styles.errorBox} role="alert">
        Camera access is not available in this browser. Use Chrome or Edge.
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox} role="alert">
        <p style={{ margin: '0 0 10px' }}>{error}</p>
        <button onClick={startStream} style={styles.retryBtn} aria-label="Retry camera access">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <video
        ref={videoRef}
        width={width}
        height={height}
        muted
        playsInline
        style={styles.video}
        aria-label="Live camera feed for safety monitoring"
      />
      {isActive && (
        <div style={styles.indicator} aria-live="polite" aria-label="Camera active">
          <span style={styles.dot} /> Camera active
        </div>
      )}
    </div>
  );
});

const styles = {
  wrapper: { position: 'relative', display: 'inline-block' },
  video: { borderRadius: '8px', display: 'block', maxWidth: '100%', background: '#000' },
  indicator: {
    position: 'absolute', top: '8px', left: '8px',
    background: 'rgba(0,0,0,0.6)', color: '#fff',
    padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
    display: 'flex', alignItems: 'center', gap: '6px',
  },
  dot: {
    display: 'inline-block', width: '8px', height: '8px',
    borderRadius: '50%', background: '#f44336',
  },
  errorBox: {
    padding: '16px', background: '#FFF3E0', border: '2px solid #FF9800',
    borderRadius: '8px', color: '#333',
  },
  retryBtn: {
    padding: '8px 16px', background: '#FF9800', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600',
  },
};

export default VideoCapture;
