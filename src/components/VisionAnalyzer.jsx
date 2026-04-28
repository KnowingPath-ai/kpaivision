import React, { useState, useEffect, useRef } from 'react';
import { RawImage } from '@huggingface/transformers';
import { useSmolVLMModel } from '../context/SmolVLMModelContext';
import VideoCapture from './VideoCapture';

// KnowingPath.ai design tokens
const KP = {
  bg:      '#050912',
  surface: 'rgba(10, 15, 30, 0.85)',
  card:    'rgba(15, 23, 41, 0.90)',
  border:  'rgba(91, 163, 217, 0.18)',
  accent:  '#5BA3D9',
  accentHi:'#82C0EE',
  gold:    '#D4A843',
  text:    '#E2E8F0',
  muted:   '#94A3B8',
  dim:     '#475569',
  danger:  '#FCA5A5',
};

// Ascending Bridge logo — KnowingPath.ai brand mark
const KPLogo = ({ size = 40 }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 44 44" fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <circle cx="22" cy="22" r="21"
      fill="rgba(91,163,217,0.12)"
      stroke="rgba(91,163,217,0.40)"
      strokeWidth="1"
    />
    <path d="M8 30 Q22 10 36 30"
      stroke="#5BA3D9" strokeWidth="2.5" strokeLinecap="round" fill="none"
    />
    <path d="M12 30 L12 26" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 30 L18 22" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 30 L24 19" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30 30 L30 22" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 30 L36 26" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="22" cy="11" r="2.5" fill="#5BA3D9" opacity="0.8"/>
  </svg>
);

const PRESET_PROMPTS = [
  { label: 'Identify Objects', prompt: 'What objects are visible in this image?' },
  { label: 'Extract Text',     prompt: 'What text appears in this image?' },
  { label: 'Analyze Mood',     prompt: 'Describe the mood and atmosphere of this image.' },
];

const NAV_ITEMS = [
  { id: 'home',        label: 'Home',           action: 'home' },
  { id: 'safety',      label: 'Shield Monitor', action: 'safety' },
  { id: 'about',       label: 'Capabilities',   action: 'about' },
  { id: 'howItWorks',  label: 'How It Works',   action: 'howItWorks' },
];

const VisionAnalyzer = ({ onShowAbout, onShowSafety, onShowHowItWorks }) => {
  const { modelRef, processorRef, modelReady, modelLoading, modelError, ensureLoaded } = useSmolVLMModel();
  const [analyzing, setAnalyzing]           = useState(false);
  const [result, setResult]                 = useState(null);
  const [imageUrl, setImageUrl]             = useState(null);
  const [currentPrompt, setCurrentPrompt]   = useState(null);
  const [cameraMode, setCameraMode]         = useState(false);
  const [currentBlob, setCurrentBlob]       = useState(null);
  const fileInputRef    = useRef(null);
  const videoCaptureRef = useRef(null);

  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);

  const handleNavAction = (action) => {
    if (action === 'safety')     onShowSafety();
    if (action === 'about')      onShowAbout();
    if (action === 'howItWorks') onShowHowItWorks();
    if (action === 'home')       window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageUrl(URL.createObjectURL(file));
      setResult(null);
      setCurrentBlob(file);
      analyzeImage(file);
    }
  };

  const handleCaptureAndAnalyze = async () => {
    if (!videoCaptureRef.current) return;
    const blob = await videoCaptureRef.current.captureSnapshot();
    if (!blob) return;
    setImageUrl(URL.createObjectURL(blob));
    setResult(null);
    setCurrentBlob(blob);
    analyzeImage(blob);
  };

  const analyzeImage = async (file, customPrompt = null) => {
    if (!modelRef.current || !processorRef.current) return;
    const model       = modelRef.current;
    const processor   = processorRef.current;
    const instruction = customPrompt || 'Describe this image in detail.';
    setCurrentPrompt(instruction);
    setAnalyzing(true);
    setResult(null);
    try {
      const image    = await RawImage.fromBlob(file);
      const messages = [{ role: 'user', content: [{ type: 'image' }, { type: 'text', text: instruction }] }];
      const text     = processor.apply_chat_template(messages, { add_generation_prompt: true });
      const inputs   = await processor(text, [image], { do_image_splitting: false });
      const generatedIds = await model.generate({ ...inputs, max_new_tokens: 100 });
      const output   = processor.batch_decode(
        generatedIds.slice(null, [inputs.input_ids.dims.at(-1), null]),
        { skip_special_tokens: true }
      );
      setResult(output[0].trim());
    } catch (error) {
      console.error('Analysis error:', error);
      setResult(`Error: ${error.message}`);
    }
    setAnalyzing(false);
  };

  const handlePresetPrompt = (prompt) => {
    if (currentBlob) analyzeImage(currentBlob, prompt);
  };

  const loading = modelLoading && !modelReady;

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '28px 20px', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
        paddingBottom: '20px', borderBottom: `1px solid ${KP.border}`,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <KPLogo size={42} />
          <div>
            <h1 style={{
              margin: 0, fontSize: '1.1875rem', fontWeight: 800,
              color: KP.text, letterSpacing: '-0.02em', lineHeight: 1.2,
            }}>
              KnowingPath Vision
            </h1>
            <div style={{ fontSize: '0.6875rem', color: KP.accent, fontStyle: 'italic', lineHeight: 1.4 }}>
              Private AI. See Everything. Share Nothing.
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {NAV_ITEMS.map(({ id, label, action }) => (
            <button
              key={id}
              onClick={() => handleNavAction(action)}
              style={kpNavBtn(id === 'safety')}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Loading ─────────────────────────────────────────────── */}
      {loading ? (
        <div style={card({ borderColor: 'rgba(212,168,67,0.35)', bg: 'rgba(18,14,4,0.85)' })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Spinner color={KP.gold} />
            <div>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: KP.text, margin: 0 }}>
                Loading SmolVLM-500M via WebGPU…
              </p>
              <p style={{ fontSize: '0.8125rem', color: KP.muted, margin: '5px 0 0' }}>
                First load takes ~1-2 min · Model cached for instant future use · Requires Chrome/Edge 113+
              </p>
            </div>
          </div>
        </div>

      /* ── Error ──────────────────────────────────────────────── */
      ) : modelError ? (
        <div style={card({ borderColor: 'rgba(239,68,68,0.35)', bg: 'rgba(20,5,5,0.85)' })}>
          <p style={{ margin: 0, color: KP.danger, fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {modelError.includes('WebGPU')
              ? 'WebGPU not available. Please use Chrome/Edge 113+ with a compatible GPU.'
              : `Model error: ${modelError}`}
          </p>
        </div>

      /* ── Main interface ─────────────────────────────────────── */
      ) : (
        <div>
          {/* Mode tabs */}
          <div style={{
            display: 'flex', gap: '4px', marginBottom: '20px',
            background: 'rgba(255,255,255,0.035)', borderRadius: '10px',
            padding: '4px', width: 'fit-content',
            border: `1px solid ${KP.border}`,
          }}>
            <button onClick={() => setCameraMode(false)} aria-pressed={!cameraMode} style={tab(!cameraMode)}>
              Upload Image
            </button>
            <button onClick={() => setCameraMode(true)} aria-pressed={cameraMode} style={tab(cameraMode)}>
              Use Camera
            </button>
          </div>

          {/* Upload mode */}
          {!cameraMode && (
            <>
              <input
                type="file" ref={fileInputRef}
                onChange={handleImageSelect} accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={analyzing || !modelReady}
                className="kp-btn-glow"
                style={actionBtn(analyzing || !modelReady)}
              >
                {analyzing ? 'Analyzing…' : !modelReady ? 'Model not loaded' : 'Select Image'}
              </button>
            </>
          )}

          {/* Camera mode */}
          {cameraMode && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              <VideoCapture ref={videoCaptureRef} enabled={true} />
              <button
                onClick={handleCaptureAndAnalyze}
                disabled={analyzing || !modelReady}
                className="kp-btn-glow"
                style={actionBtn(analyzing || !modelReady)}
                aria-label="Capture snapshot and analyze"
              >
                {analyzing ? 'Analyzing…' : !modelReady ? 'Model not loaded' : 'Capture & Analyze'}
              </button>
            </div>
          )}

          {/* Image + controls */}
          {imageUrl && (
            <div style={{ marginTop: '26px' }}>
              <img
                src={imageUrl} alt="Selected"
                style={{
                  maxWidth: '100%', borderRadius: '12px', display: 'block',
                  boxShadow: `0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px ${KP.border}`,
                }}
              />

              {/* Preset prompt chips */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {PRESET_PROMPTS.map(({ label, prompt }) => (
                  <button
                    key={label}
                    onClick={() => handlePresetPrompt(prompt)}
                    disabled={analyzing}
                    style={chip(analyzing)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Analyzing indicator */}
              {analyzing && (
                <div style={{ marginTop: '16px', ...card({ borderColor: 'rgba(91,163,217,0.35)' }) }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Spinner color={KP.accent} />
                    <div>
                      <div style={{ fontWeight: 600, color: KP.text, fontSize: '0.9375rem' }}>Analyzing…</div>
                      <div style={{ fontSize: '0.8125rem', color: KP.muted, marginTop: '3px' }}>{currentPrompt}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {result && (
            <div style={{
              marginTop: '26px',
              ...card({ borderColor: 'rgba(91,163,217,0.25)' }),
              borderLeft: `3px solid ${KP.accent}`,
            }}>
              <h3 style={{
                marginTop: 0, color: KP.accent, fontSize: '0.75rem',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                marginBottom: '14px',
              }}>
                Analysis Result
              </h3>
              {currentPrompt && (
                <div style={{
                  fontSize: '0.8125rem', color: KP.muted, fontStyle: 'italic',
                  marginBottom: '14px', padding: '8px 12px',
                  background: 'rgba(91,163,217,0.06)', borderRadius: '6px',
                  borderLeft: `2px solid rgba(91,163,217,0.30)`,
                }}>
                  {currentPrompt}
                </div>
              )}
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.75', margin: '0 0 16px', color: KP.text }}>
                {result}
              </p>
              <div style={{
                fontSize: '0.75rem', color: KP.dim, fontStyle: 'italic',
                borderTop: `1px solid ${KP.border}`, paddingTop: '12px',
              }}>
                ◆ Processed entirely on your device · Zero data sent to servers
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{
        marginTop: '52px', paddingTop: '20px',
        borderTop: `1px solid ${KP.border}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '8px', textAlign: 'center',
      }}>
        <span style={{ fontSize: '0.8125rem', color: KP.muted }}>
          Powered by SmolVLM-500M · WebGPU on-device inference · Zero data leaves your browser
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <KPLogo size={20} />
          <span style={{ fontSize: '0.75rem', color: KP.dim, fontStyle: 'italic' }}>
            © 2026 KnowingPath.ai · A KnowingPath.ai ecosystem tool · Privacy-first visual intelligence
          </span>
        </div>
      </footer>
    </div>
  );
};

// ── Style helpers ───────────────────────────────────────────────

function card({ borderColor = 'rgba(91,163,217,0.18)', bg = 'rgba(10,15,30,0.88)' } = {}) {
  return {
    padding: '20px 22px',
    background: bg,
    borderRadius: '12px',
    border: `1px solid ${borderColor}`,
  };
}

function kpNavBtn(isAccent = false) {
  return {
    padding: '7px 13px',
    background: isAccent ? 'rgba(99,102,241,0.10)' : 'rgba(91,163,217,0.07)',
    color: isAccent ? 'rgba(165,167,255,0.90)' : '#82C0EE',
    border: `1px solid ${isAccent ? 'rgba(99,102,241,0.30)' : 'rgba(91,163,217,0.25)'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: '0.8125rem',
    transition: 'all 0.2s',
    letterSpacing: '0.01em',
  };
}

function tab(active) {
  return {
    padding: '6px 16px',
    fontSize: '0.875rem',
    fontWeight: active ? 700 : 500,
    fontFamily: "'Inter', sans-serif",
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: active ? 'rgba(91,163,217,0.16)' : 'transparent',
    color: active ? '#82C0EE' : '#94A3B8',
    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
  };
}

function actionBtn(disabled) {
  return {
    padding: '12px 28px',
    fontSize: '0.9375rem',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    background: disabled
      ? 'rgba(255,255,255,0.05)'
      : 'linear-gradient(135deg, #5BA3D9 0%, #3A7FAD 100%)',
    color: disabled ? '#475569' : '#0A0F1E',
    border: 'none',
    borderRadius: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.01em',
  };
}

function chip(disabled) {
  return {
    padding: '7px 15px',
    background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(91,163,217,0.09)',
    color: disabled ? '#475569' : '#82C0EE',
    border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : 'rgba(91,163,217,0.28)'}`,
    borderRadius: '20px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '0.8125rem',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    transition: 'all 0.2s',
  };
}

function Spinner({ color }) {
  return (
    <div style={{
      width: '20px', height: '20px', flexShrink: 0,
      border: `2.5px solid ${color}30`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.9s linear infinite',
    }} />
  );
}

export default VisionAnalyzer;
