import React, { useState } from 'react';
import { SafetyProvider, useSafety } from '../../context/SafetyContext';
import VideoCapture from '../VideoCapture';
import AlertBanner from '../SafetyFeature/AlertBanner';
import SafetyDashboard from '../SafetyFeature/SafetyDashboard';
import SafetySettings from './SafetySettings';
import { useSafetyLoop } from '../../hooks/useSafetyLoop';

function SafetyMonitorInner() {
  const { state, acknowledgeAlert, setMonitoring, clearTracks } = useSafety();
  const { processFrame, engineReady, engineError, fps, videoCaptureRef } = useSafetyLoop();
  const [showSettings, setShowSettings] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleToggle = () => {
    const next = !state.isMonitoring;
    setMonitoring(next);
    if (!next) clearTracks();
  };

  const isDesktop = !!navigator.gpu || window.location.hostname === 'localhost';

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Safety Monitor</h2>
          <p style={styles.subtitle}>
            On-device repeated-presence detection &mdash; all processing stays on your device
          </p>
        </div>
        <div style={styles.headerBtns}>
          <button onClick={() => setShowSettings((s) => !s)} style={styles.outlineBtn} aria-label="Toggle settings">
            Settings
          </button>
          <button onClick={() => setShowDashboard((s) => !s)} style={styles.outlineBtn} aria-label="Toggle status panel">
            {showDashboard ? 'Hide' : 'Show'} Status
          </button>
        </div>
      </div>

      {/* Mobile / No-WebGPU notice */}
      {!isDesktop && (
        <div style={styles.noticeBox} role="note">
          Face detection works on this device (WebGL). SmolVLM context alerts require Chrome/Edge
          with WebGPU and will fall back to a generic safety message on this device.
        </div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <div style={styles.section}>
          <SafetySettings onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* Alert banner */}
      {state.smolvlmAlertText && (
        <div style={styles.section}>
          <AlertBanner message={state.smolvlmAlertText} onDismiss={acknowledgeAlert} />
        </div>
      )}

      {/* Engine error */}
      {engineError && (
        <div style={styles.errorBox} role="alert">
          Face detection unavailable: {engineError}. Please refresh or try a different browser.
        </div>
      )}

      {/* Main camera + controls */}
      {!state.isMonitoring ? (
        <div style={styles.onboardBox}>
          <h3 style={styles.onboardHeading}>How it works</h3>
          <ul style={styles.onboardList}>
            <li>Your camera captures frames locally &mdash; nothing is sent to any server.</li>
            <li>Faces are detected and compared over time using on-device AI.</li>
            <li>If the same person appears repeatedly, you receive a subtle safety notice.</li>
            <li>All data is cleared when you stop monitoring or close this page.</li>
          </ul>
          <button onClick={handleToggle} style={styles.startBtn} aria-label="Enable safety monitoring">
            Enable Safety Monitoring
          </button>
        </div>
      ) : (
        <div style={styles.cameraSection}>
          <VideoCapture
            ref={videoCaptureRef}
            onFrame={processFrame}
            frameIntervalMs={500}
            enabled={state.isMonitoring}
          />
          <div style={styles.cameraControls}>
            {engineReady ? (
              <span style={styles.badge('green')}>Face detection active</span>
            ) : (
              <span style={styles.badge('orange')}>Loading face model…</span>
            )}
            <button onClick={handleToggle} style={styles.stopBtn} aria-label="Stop safety monitoring">
              Stop Monitoring
            </button>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {showDashboard && state.isMonitoring && (
        <div style={styles.section}>
          <SafetyDashboard fps={fps} />
        </div>
      )}

      {/* Privacy footer */}
      <p style={styles.privacy}>
        Privacy-first &mdash; no images stored, no data transmitted, ephemeral session only.
      </p>
    </div>
  );
}

function SafetyMonitor(props) {
  return (
    <SafetyProvider>
      <SafetyMonitorInner {...props} />
    </SafetyProvider>
  );
}

const styles = {
  page: { maxWidth: '860px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
  title: { color: '#00897B', margin: '0 0 4px', fontSize: '24px' },
  subtitle: { color: '#666', margin: 0, fontSize: '14px' },
  headerBtns: { display: 'flex', gap: '8px' },
  outlineBtn: { padding: '8px 14px', background: 'transparent', color: '#00897B', border: '2px solid #00897B', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  section: { marginBottom: '16px' },
  noticeBox: { background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: '6px', padding: '12px 14px', color: '#1D4ED8', fontSize: '13px', marginBottom: '16px' },
  errorBox: { background: '#FEF2F2', border: '2px solid #FCA5A5', borderRadius: '8px', padding: '12px', color: '#B91C1C', marginBottom: '16px' },
  onboardBox: { background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: '10px', padding: '24px', textAlign: 'center' },
  onboardHeading: { color: '#15803D', marginTop: 0 },
  onboardList: { textAlign: 'left', display: 'inline-block', color: '#334155', lineHeight: '1.8', fontSize: '14px' },
  startBtn: { marginTop: '16px', padding: '12px 28px', background: '#00897B', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' },
  cameraSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  cameraControls: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' },
  badge: (color) => ({
    padding: '4px 12px',
    background: color === 'green' ? '#D1FAE5' : '#FEF3C7',
    color: color === 'green' ? '#065F46' : '#92400E',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
  }),
  stopBtn: { padding: '8px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  privacy: { textAlign: 'center', color: '#94A3B8', fontSize: '12px', marginTop: '24px', fontStyle: 'italic' },
};

export default SafetyMonitor;
