import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { DEFAULT_TRACKER_CONFIG } from '../../services/Tracker/thresholds';

function SafetySettings({ onClose }) {
  const { state, updateConfig } = useSafety();
  const [draft, setDraft] = useState({ ...state.config });

  const handleChange = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    updateConfig(draft);
    if (onClose) onClose();
  };

  const handleReset = () => {
    setDraft({ ...DEFAULT_TRACKER_CONFIG });
    updateConfig({ ...DEFAULT_TRACKER_CONFIG });
  };

  return (
    <div style={styles.panel} role="dialog" aria-label="Safety monitor settings">
      <h3 style={styles.heading}>Safety Monitor Settings</h3>

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Face Matching</legend>

        <label style={styles.label}>
          Similarity threshold (higher = stricter matching):
          <span style={styles.value}>{draft.SIM_THRESHOLD.toFixed(2)}</span>
          <input
            type="range" min="0.5" max="0.95" step="0.05"
            value={draft.SIM_THRESHOLD}
            onChange={(e) => handleChange('SIM_THRESHOLD', parseFloat(e.target.value))}
            style={styles.slider}
            aria-label="Similarity threshold"
          />
          <span style={styles.hint}>0.50 = loose  •  0.95 = very strict</span>
        </label>
      </fieldset>

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Alert Conditions</legend>

        <label style={styles.label}>
          Minimum duration before alert (minutes):
          <span style={styles.value}>{Math.round(draft.MIN_DURATION_MS / 60000)}</span>
          <input
            type="range" min="1" max="30" step="1"
            value={Math.round(draft.MIN_DURATION_MS / 60000)}
            onChange={(e) => handleChange('MIN_DURATION_MS', parseInt(e.target.value, 10) * 60000)}
            style={styles.slider}
            aria-label="Minimum duration in minutes"
          />
        </label>

        <label style={styles.label}>
          Minimum detections required:
          <span style={styles.value}>{draft.MIN_FRAME_COUNT}</span>
          <input
            type="range" min="2" max="20" step="1"
            value={draft.MIN_FRAME_COUNT}
            onChange={(e) => handleChange('MIN_FRAME_COUNT', parseInt(e.target.value, 10))}
            style={styles.slider}
            aria-label="Minimum frame count"
          />
        </label>

        <label style={styles.label}>
          Alert cooldown (minutes, prevents repeat alerts):
          <span style={styles.value}>{Math.round(draft.ALERT_COOLDOWN_MS / 60000)}</span>
          <input
            type="range" min="1" max="30" step="1"
            value={Math.round(draft.ALERT_COOLDOWN_MS / 60000)}
            onChange={(e) => handleChange('ALERT_COOLDOWN_MS', parseInt(e.target.value, 10) * 60000)}
            style={styles.slider}
            aria-label="Alert cooldown in minutes"
          />
        </label>
      </fieldset>

      <div style={styles.btnRow}>
        <button onClick={handleSave} style={styles.saveBtn} aria-label="Save settings">Save</button>
        <button onClick={handleReset} style={styles.resetBtn} aria-label="Reset to defaults">Reset defaults</button>
        {onClose && (
          <button onClick={onClose} style={styles.cancelBtn} aria-label="Cancel">Cancel</button>
        )}
      </div>
    </div>
  );
}

const styles = {
  panel: { background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px' },
  heading: { margin: '0 0 16px', color: '#1E293B', fontSize: '16px' },
  fieldset: { border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 16px', marginBottom: '12px' },
  legend: { color: '#475569', fontWeight: '600', fontSize: '13px', padding: '0 6px' },
  label: { display: 'block', marginBottom: '14px', color: '#334155', fontSize: '14px', lineHeight: '1.6' },
  value: { fontWeight: '700', color: '#0F172A', marginLeft: '8px' },
  slider: { display: 'block', width: '100%', marginTop: '6px', accentColor: '#00897B' },
  hint: { fontSize: '11px', color: '#94A3B8' },
  btnRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  saveBtn: { padding: '8px 20px', background: '#00897B', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  resetBtn: { padding: '8px 20px', background: 'transparent', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' },
  cancelBtn: { padding: '8px 20px', background: 'transparent', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' },
};

export default SafetySettings;
