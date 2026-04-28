import React, { useEffect, useRef } from 'react';

function AlertBanner({ message, onDismiss, autoDismissMs = 30000 }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!message) return;
    timerRef.current = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timerRef.current);
  }, [message, onDismiss, autoDismissMs]);

  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={styles.banner}
    >
      <div style={styles.iconRow}>
        <span style={styles.icon} aria-hidden="true">⚠</span>
        <strong style={styles.heading}>Safety Notice</strong>
        <button
          onClick={onDismiss}
          style={styles.closeBtn}
          aria-label="Dismiss safety notice"
        >
          ✕
        </button>
      </div>
      <p style={styles.message}>{message}</p>
      <p style={styles.disclaimer}>
        This is an automated observation, not a definitive judgment. Use your own discretion.
      </p>
      <div style={styles.actions}>
        <button onClick={onDismiss} style={styles.ackBtn} aria-label="Acknowledge and dismiss alert">
          Got it
        </button>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    background: '#FEF9C3',
    border: '2px solid #CA8A04',
    borderLeft: '6px solid #CA8A04',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  icon: { fontSize: '20px', color: '#92400E' },
  heading: { flex: 1, color: '#92400E', fontSize: '16px' },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#92400E',
    padding: '0 4px',
    lineHeight: 1,
  },
  message: {
    margin: '0 0 8px',
    color: '#1C1917',
    fontSize: '15px',
    lineHeight: '1.5',
  },
  disclaimer: {
    margin: '0 0 12px',
    color: '#78716C',
    fontSize: '12px',
    fontStyle: 'italic',
  },
  actions: { display: 'flex', gap: '10px' },
  ackBtn: {
    padding: '8px 20px',
    background: '#CA8A04',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
};

export default AlertBanner;
