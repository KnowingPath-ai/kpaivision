import React, { useState } from 'react';
import { SafetyProvider, useSafety } from '../../context/SafetyContext';
import VideoCapture from '../VideoCapture';
import AlertBanner from '../SafetyFeature/AlertBanner';
import SafetyDashboard from '../SafetyFeature/SafetyDashboard';
import SafetySettings from './SafetySettings';
import { useSafetyLoop } from '../../hooks/useSafetyLoop';

const KP = {
  border:  'rgba(91, 163, 217, 0.18)',
  accent:  '#5BA3D9',
  accentHi:'#82C0EE',
  gold:    '#D4A843',
  text:    '#E2E8F0',
  muted:   '#94A3B8',
  dim:     '#475569',
  bg:      'rgba(10,15,30,0.88)',
};

const KPLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
    <circle cx="22" cy="22" r="21" fill="rgba(91,163,217,0.12)" stroke="rgba(91,163,217,0.40)" strokeWidth="1"/>
    <path d="M8 30 Q22 10 36 30" stroke="#5BA3D9" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M12 30 L12 26" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 30 L18 22" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 30 L24 19" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30 30 L30 22" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 30 L36 26" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="22" cy="11" r="2.5" fill="#5BA3D9" opacity="0.8"/>
  </svg>
);

function SafetyMonitorInner({ onBack }) {
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
    <div style={S.page}>

      {/* KP Brand header */}
      <header style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <KPLogo size={42} />
          <div>
            <div style={{ margin: 0, fontSize: '1.1875rem', fontWeight: 800, color: KP.text, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              KnowingPath Vision
            </div>
            <div style={{ fontSize: '0.6875rem', color: KP.accent, fontStyle: 'italic', lineHeight: 1.4 }}>
              Private AI. See Everything. Share Nothing.
            </div>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={S.backBtn} aria-label="Back to main">
            ← Back to Home
          </button>
        )}
      </header>

      {/* Page title row */}
      <div style={S.titleRow}>
        <div>
          <h2 style={S.title}>🛡 Safety Monitor</h2>
          <p style={S.subtitle}>
            On-device repeated-presence detection — all processing stays on your device
          </p>
        </div>
        <div style={S.headerBtns}>
          <button onClick={() => setShowSettings((s) => !s)} style={S.outlineBtn} aria-label="Toggle settings">
            Settings
          </button>
          <button onClick={() => setShowDashboard((s) => !s)} style={S.outlineBtn} aria-label="Toggle status panel">
            {showDashboard ? 'Hide' : 'Show'} Status
          </button>
        </div>
      </div>

      {/* Mobile / No-WebGPU notice */}
      {!isDesktop && (
        <div style={S.noticeBox} role="note">
          Face detection works on this device (WebGL). SmolVLM context alerts require Chrome/Edge
          with WebGPU and will fall back to a generic safety message on this device.
        </div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <div style={S.section}>
          <SafetySettings onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* Alert banner */}
      {state.smolvlmAlertText && (
        <div style={S.section}>
          <AlertBanner message={state.smolvlmAlertText} onDismiss={acknowledgeAlert} />
        </div>
      )}

      {/* Engine error */}
      {engineError && (
        <div style={S.errorBox} role="alert">
          Face detection unavailable: {engineError}. Please refresh or try a different browser.
        </div>
      )}

      {/* Main camera + controls */}
      {!state.isMonitoring ? (
        <div style={S.onboardBox}>
          <h3 style={S.onboardHeading}>How it works</h3>
          <ul style={S.onboardList}>
            <li>Your camera captures frames locally — nothing is sent to any server.</li>
            <li>Faces are detected and compared over time using on-device AI.</li>
            <li>If the same person appears repeatedly, you receive a subtle safety notice.</li>
            <li>All data is cleared when you stop monitoring or close this page.</li>
          </ul>
          <button onClick={handleToggle} style={S.startBtn} aria-label="Enable safety monitoring">
            Enable Safety Monitoring
          </button>
        </div>
      ) : (
        <div style={S.cameraSection}>
          <VideoCapture
            ref={videoCaptureRef}
            onFrame={processFrame}
            frameIntervalMs={500}
            enabled={state.isMonitoring}
          />
          <div style={S.cameraControls}>
            {engineReady ? (
              <span style={S.badge('green')}>Face detection active</span>
            ) : (
              <span style={S.badge('orange')}>Loading face model…</span>
            )}
            <button onClick={handleToggle} style={S.stopBtn} aria-label="Stop safety monitoring">
              Stop Monitoring
            </button>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {showDashboard && state.isMonitoring && (
        <div style={S.section}>
          <SafetyDashboard fps={fps} />
        </div>
      )}

      {/* Footer */}
      <footer style={S.footer}>
        <span style={{ fontSize: '0.8125rem', color: KP.muted }}>
          Powered by SmolVLM-500M · WebGPU on-device inference · Zero data leaves your browser
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <KPLogo size={18} />
          <span style={{ fontSize: '0.75rem', color: KP.dim, fontStyle: 'italic' }}>
            © 2026 KnowingPath.ai · Privacy-first visual intelligence
          </span>
        </div>
      </footer>
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

const S = {
  page: {
    maxWidth: '860px', margin: '0 auto', padding: '28px 20px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: '20px', borderBottom: `1px solid rgba(91,163,217,0.18)`,
    marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
  },
  backBtn: {
    padding: '8px 18px', background: 'rgba(91,163,217,0.10)',
    color: '#82C0EE', border: '1px solid rgba(91,163,217,0.30)',
    borderRadius: '8px', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    fontWeight: 600, fontSize: '0.875rem',
  },
  titleRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
  },
  title: { color: '#82C0EE', margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
  subtitle: { color: '#94A3B8', margin: 0, fontSize: '0.875rem', lineHeight: 1.6 },
  headerBtns: { display: 'flex', gap: '8px', flexShrink: 0 },
  outlineBtn: {
    padding: '8px 14px', background: 'rgba(91,163,217,0.08)',
    color: '#82C0EE', border: '1px solid rgba(91,163,217,0.30)',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem',
    fontFamily: "'Inter', sans-serif",
  },
  section: { marginBottom: '16px' },
  noticeBox: {
    background: 'rgba(91,163,217,0.08)', border: '1px solid rgba(91,163,217,0.28)',
    borderRadius: '8px', padding: '12px 14px', color: '#82C0EE',
    fontSize: '0.8125rem', marginBottom: '16px', lineHeight: 1.6,
  },
  errorBox: {
    background: 'rgba(185,28,28,0.12)', border: '2px solid rgba(252,165,165,0.40)',
    borderRadius: '8px', padding: '12px', color: '#FCA5A5', marginBottom: '16px',
    fontSize: '0.875rem',
  },
  onboardBox: {
    background: 'rgba(10,15,30,0.88)', border: `1px solid rgba(91,163,217,0.25)`,
    borderRadius: '12px', padding: '28px', textAlign: 'center',
  },
  onboardHeading: { color: '#82C0EE', marginTop: 0, fontWeight: 700, fontSize: '1.0625rem' },
  onboardList: {
    textAlign: 'left', display: 'inline-block', color: '#94A3B8',
    lineHeight: '1.85', fontSize: '0.9rem', margin: '0 0 0',
  },
  startBtn: {
    marginTop: '20px', padding: '12px 32px',
    background: 'linear-gradient(135deg, #5BA3D9 0%, #3A7FAD 100%)',
    color: '#0A0F1E', border: 'none', borderRadius: '10px',
    cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0 4px 15px rgba(91,163,217,0.38)',
  },
  cameraSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  cameraControls: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' },
  badge: (color) => ({
    padding: '4px 14px',
    background: color === 'green' ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.12)',
    color: color === 'green' ? '#4ADE80' : '#FBBF24',
    border: `1px solid ${color === 'green' ? 'rgba(74,222,128,0.30)' : 'rgba(251,191,36,0.30)'}`,
    borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
  }),
  stopBtn: {
    padding: '8px 20px', background: 'rgba(220,38,38,0.15)',
    color: '#FCA5A5', border: '1px solid rgba(252,165,165,0.35)',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
    fontFamily: "'Inter', sans-serif", fontSize: '0.875rem',
  },
  footer: {
    marginTop: '48px', paddingTop: '20px',
    borderTop: '1px solid rgba(91,163,217,0.18)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '8px', textAlign: 'center',
  },
};

export default SafetyMonitor;
