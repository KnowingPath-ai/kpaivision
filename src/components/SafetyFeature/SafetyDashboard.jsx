import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { useSmolVLMModel } from '../../context/SmolVLMModelContext';

function SafetyDashboard({ fps = 0 }) {
  const { state } = useSafety();
  const { modelReady, modelLoading, modelError } = useSmolVLMModel();

  const modelStatus = modelLoading ? 'Loading...' : modelError ? 'Unavailable (mobile/no WebGPU)' : modelReady ? 'Ready' : 'Not loaded';
  const lastAlert = state.lastRepeatedPresenceEvent
    ? new Date(state.lastRepeatedPresenceEvent.timestamp).toLocaleTimeString()
    : 'None';

  return (
    <div style={styles.panel} aria-label="Safety monitor debug panel">
      <h4 style={styles.heading}>Monitor Status</h4>
      <dl style={styles.dl}>
        <div style={styles.row}>
          <dt style={styles.dt}>Active Tracks</dt>
          <dd style={styles.dd}>{state.activeTracks.length}</dd>
        </div>
        <div style={styles.row}>
          <dt style={styles.dt}>Processing Rate</dt>
          <dd style={styles.dd}>{fps > 0 ? `${fps.toFixed(1)} fps` : '—'}</dd>
        </div>
        <div style={styles.row}>
          <dt style={styles.dt}>SmolVLM</dt>
          <dd style={{ ...styles.dd, color: modelReady ? '#16a34a' : modelLoading ? '#d97706' : '#6b7280' }}>
            {modelStatus}
          </dd>
        </div>
        <div style={styles.row}>
          <dt style={styles.dt}>Last Alert</dt>
          <dd style={styles.dd}>{lastAlert}</dd>
        </div>
        <div style={styles.row}>
          <dt style={styles.dt}>Monitoring</dt>
          <dd style={{ ...styles.dd, color: state.isMonitoring ? '#16a34a' : '#6b7280' }}>
            {state.isMonitoring ? 'Active' : 'Stopped'}
          </dd>
        </div>
      </dl>
    </div>
  );
}

const styles = {
  panel: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '13px',
  },
  heading: { margin: '0 0 10px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' },
  dl: { margin: 0 },
  row: { display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #F1F5F9' },
  dt: { color: '#64748B', fontWeight: '500' },
  dd: { margin: 0, color: '#1E293B', fontWeight: '600' },
};

export default SafetyDashboard;
