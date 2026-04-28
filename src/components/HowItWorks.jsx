import React, { useState } from 'react';

const KP = {
  border:  'rgba(91, 163, 217, 0.18)',
  accent:  '#5BA3D9',
  accentHi:'#82C0EE',
  gold:    '#D4A843',
  text:    '#E2E8F0',
  muted:   '#94A3B8',
  dim:     '#475569',
  danger:  '#FCA5A5',
  warn:    '#FCD34D',
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

// ── Reusable section card ──────────────────────────────────────
const SectionCard = ({ children, borderColor = KP.border, bg = 'rgba(10,15,30,0.88)', style = {} }) => (
  <div style={{
    padding: '22px 24px', borderRadius: '14px', border: `1px solid ${borderColor}`,
    background: bg, marginBottom: '20px', ...style,
  }}>
    {children}
  </div>
);

// ── Step number badge ─────────────────────────────────────────
const StepBadge = ({ n }) => (
  <div style={{
    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #5BA3D9 0%, #3A7FAD 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '0.875rem', color: '#0A0F1E',
  }}>
    {n}
  </div>
);

// ── Example prompt pill ───────────────────────────────────────
const PromptExample = ({ children }) => (
  <span style={{
    display: 'inline-block', padding: '4px 12px',
    background: 'rgba(91,163,217,0.10)', border: '1px solid rgba(91,163,217,0.25)',
    borderRadius: '20px', fontSize: '0.8125rem', color: KP.accentHi,
    fontFamily: "'Inter', monospace", margin: '3px 4px 3px 0',
  }}>
    {children}
  </span>
);

// ── Collapsible FAQ item ──────────────────────────────────────
const FAQ = ({ q, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${KP.border}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '14px 0', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: KP.text, fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', fontWeight: 600,
        }}
      >
        {q}
        <span style={{ color: KP.accent, fontSize: '1.1rem', marginLeft: '12px' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 0 16px', color: KP.muted, fontSize: '0.9rem', lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────
const HowItWorks = ({ onBack }) => (
  <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 20px', fontFamily: "'Inter', -apple-system, sans-serif" }}>

    {/* Header */}
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      paddingBottom: '20px', borderBottom: `1px solid ${KP.border}`, marginBottom: '32px',
      flexWrap: 'wrap', gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <KPLogo size={42} />
        <div>
          <h1 style={{ margin: 0, fontSize: '1.1875rem', fontWeight: 800, color: KP.text, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            KnowingPath Vision
          </h1>
          <div style={{ fontSize: '0.6875rem', color: KP.accent, fontStyle: 'italic', lineHeight: 1.4 }}>
            Private AI. See Everything. Share Nothing.
          </div>
        </div>
      </div>
      <button onClick={onBack} style={{
        padding: '8px 18px', background: 'rgba(91,163,217,0.10)',
        color: KP.accentHi, border: '1px solid rgba(91,163,217,0.30)',
        borderRadius: '8px', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
        fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
      }}>
        ← Back to Home
      </button>
    </header>

    {/* Page title */}
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '1.75rem', fontWeight: 800, color: KP.text, letterSpacing: '-0.03em' }}>
        How It Works
      </h2>
      <p style={{ margin: 0, color: KP.muted, fontSize: '1rem', lineHeight: 1.6 }}>
        A complete guide to using the SmolVLM Vision AI — a privacy-first, on-device image intelligence tool.
      </p>
    </div>

    {/* ── Before You Start ─────────────────────────────────── */}
    <SectionCard borderColor="rgba(212,168,67,0.40)" bg="rgba(18,14,4,0.85)" style={{ marginBottom: '28px' }}>
      <h3 style={{ margin: '0 0 18px', color: KP.gold, fontSize: '1.0625rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
        ◆ Before You Start
      </h3>

      <div style={{ display: 'grid', gap: '14px' }}>
        {/* Browser */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '1.25rem', marginTop: '1px' }}>🌐</div>
          <div>
            <div style={{ fontWeight: 700, color: KP.text, marginBottom: '3px' }}>Browser Requirement</div>
            <div style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.6 }}>
              You need <strong style={{ color: KP.text }}>Google Chrome 113+</strong> or <strong style={{ color: KP.text }}>Microsoft Edge 113+</strong> for WebGPU support.
              Firefox and Safari do not support WebGPU and will not work with this application.
            </div>
          </div>
        </div>

        {/* First load */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '1.25rem', marginTop: '1px' }}>⏱️</div>
          <div>
            <div style={{ fontWeight: 700, color: KP.text, marginBottom: '3px' }}>First-Time Load (~1-2 Minutes)</div>
            <div style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.6 }}>
              On your first visit, the AI model (~200-300 MB) downloads from HuggingFace and is initialized
              on your GPU. A gold loading spinner will appear — this is normal. After the first load,
              the model is <strong style={{ color: KP.text }}>cached in your browser</strong> and loads instantly on future visits.
            </div>
          </div>
        </div>

        {/* Camera */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '12px 14px', background: 'rgba(91,163,217,0.06)', borderRadius: '8px', border: '1px solid rgba(91,163,217,0.18)' }}>
          <div style={{ fontSize: '1.25rem', marginTop: '1px' }}>📷</div>
          <div>
            <div style={{ fontWeight: 700, color: KP.accentHi, marginBottom: '3px' }}>Camera Access (Optional)</div>
            <div style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.6 }}>
              The <strong style={{ color: KP.text }}>Use Camera</strong> mode requires camera permission from your browser.
              When you switch to that mode, a browser permission prompt will appear — click <em>Allow</em> to activate your webcam.
              <br />
              <span style={{ color: KP.dim, fontSize: '0.8125rem', marginTop: '4px', display: 'block' }}>
                You can always use <strong>Upload Image</strong> instead — no camera is required.
              </span>
            </div>
          </div>
        </div>

        {/* GPU */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '1.25rem', marginTop: '1px' }}>🖥️</div>
          <div>
            <div style={{ fontWeight: 700, color: KP.text, marginBottom: '3px' }}>GPU & Memory</div>
            <div style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.6 }}>
              The model runs on your device GPU via WebGPU. A <strong style={{ color: KP.text }}>dedicated GPU</strong> gives
              the best performance. Integrated graphics will work but may be slower. The model uses ~500 MB of GPU memory
              after quantization.
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '1.25rem', marginTop: '1px' }}>🔒</div>
          <div>
            <div style={{ fontWeight: 700, color: KP.text, marginBottom: '3px' }}>Complete Privacy</div>
            <div style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.6 }}>
              Every image you analyze stays <strong style={{ color: KP.text }}>100% on your device</strong>.
              No image data, prompts, or results are ever sent to any server. This app works offline
              once the model has been downloaded.
            </div>
          </div>
        </div>
      </div>
    </SectionCard>

    {/* ── Step-by-step ─────────────────────────────────────── */}
    <h3 style={{ margin: '0 0 16px', color: KP.text, fontSize: '1.0625rem', fontWeight: 700 }}>
      Step-by-Step Guide
    </h3>

    {/* Step 1 */}
    <SectionCard>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <StepBadge n="1" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: KP.text, fontSize: '1rem', marginBottom: '8px' }}>
            Wait for the Model to Load
          </div>
          <p style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 10px' }}>
            When you open the app for the first time, a gold loading spinner appears at the center of the
            page. The AI model is being downloaded and initialized in your browser — this is a one-time step.
          </p>
          <div style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.20)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: KP.dim }}>
            <strong style={{ color: KP.gold }}>Tip:</strong> Keep the browser tab active during loading. Switching
            to another tab may pause the WebGPU context on some systems, slowing the download.
          </div>
        </div>
      </div>
    </SectionCard>

    {/* Step 2 */}
    <SectionCard>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <StepBadge n="2" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: KP.text, fontSize: '1rem', marginBottom: '8px' }}>
            Choose Your Input Mode
          </div>
          <p style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 14px' }}>
            Two tabs appear below the header: <strong style={{ color: KP.accentHi }}>Upload Image</strong> and
            <strong style={{ color: KP.accentHi }}> Use Camera</strong>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(91,163,217,0.06)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(91,163,217,0.18)' }}>
              <div style={{ fontWeight: 700, color: KP.accentHi, marginBottom: '6px' }}>📁 Upload Image</div>
              <div style={{ color: KP.muted, fontSize: '0.875rem', lineHeight: 1.6 }}>
                Click <em>Select Image</em> and choose any photo from your device.
                Supports JPEG, PNG, WebP, GIF, and most common formats.
                No camera access needed.
              </div>
            </div>
            <div style={{ background: 'rgba(91,163,217,0.06)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(91,163,217,0.18)' }}>
              <div style={{ fontWeight: 700, color: KP.accentHi, marginBottom: '6px' }}>📷 Use Camera</div>
              <div style={{ color: KP.muted, fontSize: '0.875rem', lineHeight: 1.6 }}>
                Your browser will ask for camera permission. Accept to see a live
                video preview. When ready, click <em>Capture &amp; Analyze</em> to
                snap and analyze a frame.
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>

    {/* Step 3 */}
    <SectionCard>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <StepBadge n="3" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: KP.text, fontSize: '1rem', marginBottom: '8px' }}>
            Automatic Analysis
          </div>
          <p style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 10px' }}>
            As soon as an image is loaded or a camera frame is captured, analysis begins automatically
            using the default prompt: <em style={{ color: KP.accentHi }}>"Describe this image in detail."</em>
          </p>
          <p style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
            A blue spinner with the active prompt label will appear while the model generates
            a response. Results typically arrive in 5–20 seconds depending on your GPU.
          </p>
        </div>
      </div>
    </SectionCard>

    {/* Step 4 */}
    <SectionCard>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <StepBadge n="4" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: KP.text, fontSize: '1rem', marginBottom: '8px' }}>
            Use Preset Prompts to Dig Deeper
          </div>
          <p style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 14px' }}>
            After an image loads, three analysis chips appear beneath it. Click any to re-analyze
            the same image with a focused prompt:
          </p>
          <div style={{ display: 'grid', gap: '10px' }}>
            {[
              { label: 'Identify Objects', prompt: 'What objects are visible in this image?', desc: 'Lists every recognizable object, person, animal, or item in the scene with positional context.' },
              { label: 'Extract Text',     prompt: 'What text appears in this image?',        desc: 'Reads printed text, signs, labels, receipts, or documents visible in the photo.' },
              { label: 'Analyze Mood',     prompt: 'Describe the mood and atmosphere.',        desc: 'Describes the emotional tone, lighting style, and overall feeling of the image.' },
            ].map(({ label, prompt, desc }) => (
              <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: `1px solid ${KP.border}` }}>
                <div style={{ minWidth: '120px' }}>
                  <span style={{ display: 'inline-block', padding: '3px 10px', background: 'rgba(91,163,217,0.09)', border: '1px solid rgba(91,163,217,0.28)', borderRadius: '20px', fontSize: '0.75rem', color: KP.accentHi, fontWeight: 600 }}>
                    {label}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: KP.dim, fontStyle: 'italic', marginBottom: '4px' }}>
                    "{prompt}"
                  </div>
                  <div style={{ fontSize: '0.875rem', color: KP.muted }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>

    {/* Step 5 */}
    <SectionCard>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <StepBadge n="5" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: KP.text, fontSize: '1rem', marginBottom: '8px' }}>
            Read Your Results
          </div>
          <p style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 10px' }}>
            Results appear in a card with a blue left accent. The active prompt is shown in italics
            above the model's response so you always know which question was asked.
          </p>
          <p style={{ color: KP.muted, fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
            You can run multiple preset prompts on the same image — each replaces the previous result.
            Load a new image at any time to start fresh.
          </p>
        </div>
      </div>
    </SectionCard>

    {/* ── Prompt Examples ───────────────────────────────────── */}
    <h3 style={{ margin: '32px 0 16px', color: KP.text, fontSize: '1.0625rem', fontWeight: 700 }}>
      Example Prompts by Use Case
    </h3>

    <SectionCard>
      <div style={{ display: 'grid', gap: '20px' }}>
        {[
          {
            category: '📄 Documents & Text',
            prompts: [
              'What text appears in this image?',
              'What is the total amount on this receipt?',
              'Summarize the key points in this document.',
              'Who is the sender of this letter?',
            ],
          },
          {
            category: '🔍 Object & Scene Analysis',
            prompts: [
              'What objects are visible in this image?',
              'List all the items you can see.',
              'Describe this scene in detail.',
              'How many people are in this photo?',
            ],
          },
          {
            category: '🌍 Location & Landmarks',
            prompts: [
              'Where was this photo taken?',
              'What landmark is shown in this image?',
              'What type of environment is this?',
              'Describe the surroundings.',
            ],
          },
          {
            category: '🎨 Mood & Creative Analysis',
            prompts: [
              'Describe the mood and atmosphere of this image.',
              'What emotions does this photo convey?',
              'What is the lighting like in this scene?',
              'Describe the artistic style of this photo.',
            ],
          },
          {
            category: '🍕 Food & Nature',
            prompts: [
              'What food is shown in this image?',
              'Describe this dish.',
              'What type of animal is this?',
              'Identify the plants in this image.',
            ],
          },
          {
            category: '📊 Charts & Data',
            prompts: [
              'What trend does this chart show?',
              'Explain what this diagram represents.',
              'What can you infer from this graph?',
              'Summarize the data shown.',
            ],
          },
        ].map(({ category, prompts }) => (
          <div key={category}>
            <div style={{ fontWeight: 700, color: KP.text, fontSize: '0.9375rem', marginBottom: '10px' }}>
              {category}
            </div>
            <div>
              {prompts.map(p => <PromptExample key={p}>{p}</PromptExample>)}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>

    {/* ── FAQ ──────────────────────────────────────────────── */}
    <h3 style={{ margin: '32px 0 16px', color: KP.text, fontSize: '1.0625rem', fontWeight: 700 }}>
      Frequently Asked Questions
    </h3>

    <SectionCard style={{ padding: '8px 24px' }}>
      <FAQ q="Why does the first load take so long?">
        The AI model (SmolVLM-500M) is ~200-300 MB and needs to be downloaded from HuggingFace
        and compiled for your GPU on first use. This is a one-time cost — after that, it's cached
        locally in your browser and loads in seconds.
      </FAQ>
      <FAQ q="Can I use this without an internet connection?">
        Yes — once the model is downloaded and cached, the app works fully offline.
        Images never leave your device in any case.
      </FAQ>
      <FAQ q="My browser said 'camera access denied'. How do I fix it?">
        Click the lock icon in your browser's address bar and change the Camera permission
        to <em>Allow</em>, then refresh the page. Alternatively, use the <em>Upload Image</em> tab —
        no camera is required.
      </FAQ>
      <FAQ q="The model loaded but analysis is very slow. What can I do?">
        Make sure you're using Chrome or Edge (not Firefox/Safari). If you have a dedicated
        GPU, ensure your browser is using it (not integrated graphics). Closing other GPU-heavy
        tabs or applications can also help.
      </FAQ>
      <FAQ q="Can the model read handwriting?">
        It has limited ability with handwriting — it performs best on clear printed text.
        For very small or stylized handwriting, results may be inaccurate.
      </FAQ>
      <FAQ q="Does it recognize faces or identify specific people?">
        No. SmolVLM-500M does not perform face recognition and cannot identify individuals.
        This is by design — it is an image description model, not a surveillance tool.
      </FAQ>
      <FAQ q="What is the Shield Monitor?">
        The Shield Monitor is a separate mode that uses the camera for continuous safety
        monitoring. It analyzes live camera frames on an interval and can surface alerts
        based on what the model observes. Access it from the nav bar.
      </FAQ>
    </SectionCard>

    {/* ── Technical Specs ───────────────────────────────────── */}
    <h3 style={{ margin: '32px 0 16px', color: KP.text, fontSize: '1.0625rem', fontWeight: 700 }}>
      Technical Specifications
    </h3>

    <SectionCard>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {[
          ['Model',          'SmolVLM-500M-Instruct'],
          ['Parameters',     '500 million'],
          ['Architecture',   'Idefics3 + SmolLM2'],
          ['Vision Encoder', '93M parameters'],
          ['Visual Tokens',  '64 per 512×512 patch'],
          ['Inference',      'WebGPU (on-device)'],
          ['Quantization',   'fp16 tokens · q4 vision/decoder'],
          ['License',        'Apache 2.0'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '0.75rem', color: KP.dim, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              {label}
            </span>
            <span style={{ fontSize: '0.9rem', color: KP.text, fontWeight: 500 }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>

    {/* Back button */}
    <div style={{ marginTop: '36px', textAlign: 'center' }}>
      <button
        onClick={onBack}
        style={{
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #5BA3D9 0%, #3A7FAD 100%)',
          color: '#0A0F1E', border: 'none', borderRadius: '10px',
          cursor: 'pointer', fontFamily: "'Inter', sans-serif",
          fontWeight: 700, fontSize: '0.9375rem',
          boxShadow: '0 4px 15px rgba(91,163,217,0.38)',
          transition: 'all 0.2s', letterSpacing: '0.01em',
        }}
      >
        ← Back to Home
      </button>
    </div>

    {/* Footer */}
    <footer style={{
      marginTop: '48px', paddingTop: '20px',
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

export default HowItWorks;
