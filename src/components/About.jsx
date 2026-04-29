import React from 'react';

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

const CAPABILITIES = [
  {
    icon: '📸', n: 1, title: 'Image Captioning & Description', color: '#D4A843',
    items: [
      'Generate detailed descriptions of images',
      'Identify main subjects and context',
      'Describe scenes, settings, and compositions',
    ],
    examples: [
      'Describe this image in detail.',
      'What is happening in this picture?',
      'Provide a comprehensive caption for this image.',
    ],
  },
  {
    icon: '🔍', n: 2, title: 'Object Detection & Identification', color: '#D4A843',
    items: [
      'Identify objects, people, animals, and items in images',
      'Count objects and describe their positions',
      'Recognize common items and their relationships',
    ],
    examples: [
      'What objects are visible in this image?',
      'List all the items you can see.',
      'How many people are in this photo?',
    ],
  },
  {
    icon: '📝', n: 3, title: 'Text Extraction (OCR)', color: '#818CF8',
    items: [
      'Read and extract text from images',
      'Handle printed text, signs, labels, and documents',
      'Recognize text in various fonts and sizes',
    ],
    examples: [
      'What text appears in this image?',
      'Read the text from this sign/document.',
      'Extract all visible text.',
    ],
  },
  {
    icon: '📄', n: 4, title: 'Document Question Answering', color: '#818CF8',
    items: [
      'Answer questions about PDFs or scanned documents',
      'Extract information from forms, receipts, and invoices',
      'Understand document structure and layout',
    ],
    examples: [
      'What is the total amount on this receipt?',
      'Who is the sender of this document?',
      'Summarize the key points in this document.',
    ],
  },
  {
    icon: '📊', n: 5, title: 'Visual Reasoning', color: '#34D399',
    items: [
      'Answer questions about charts, graphs, and diagrams',
      'Interpret data visualizations',
      'Make logical inferences from visual information',
    ],
    examples: [
      'What trend does this chart show?',
      'Explain what this diagram represents.',
      'What can you infer from this graph?',
    ],
  },
  {
    icon: '🌍', n: 6, title: 'Scene Understanding', color: '#34D399',
    items: [
      'Identify locations and settings',
      'Recognize indoor vs outdoor scenes',
      'Describe environmental context',
    ],
    examples: [
      'Where was this photo taken?',
      'What type of location is this?',
      'Describe the environment in this image.',
    ],
  },
  {
    icon: '🎨', n: 7, title: 'Mood & Atmosphere Analysis', color: '#C084FC',
    items: [
      'Detect emotional tone and atmosphere',
      'Identify lighting conditions and color palettes',
      'Describe the overall feeling or mood',
    ],
    examples: [
      'Describe the mood and atmosphere of this image.',
      'What emotions does this photo convey?',
      'What is the lighting like in this scene?',
    ],
  },
  {
    icon: '🌈', n: 8, title: 'Color & Style Analysis', color: '#C084FC',
    items: [
      'Identify dominant colors',
      'Describe artistic style or photography techniques',
      'Analyze composition and visual elements',
    ],
    examples: [
      'What are the main colors in this image?',
      'Describe the artistic style of this photo.',
      'How is this image composed?',
    ],
  },
  {
    icon: '🏃', n: 9, title: 'Activity & Action Recognition', color: '#FBBF24',
    items: [
      'Identify what people or animals are doing',
      'Describe movements and interactions',
      'Recognize sports, activities, and gestures',
    ],
    examples: [
      'What activity is taking place?',
      'What are the people doing?',
      'Describe the action in this image.',
    ],
  },
  {
    icon: '🏛️', n: 10, title: 'Landmark & Famous Place Recognition', color: '#FBBF24',
    items: [
      'Identify well-known landmarks and monuments',
      'Recognize famous buildings and locations',
      'Provide context about tourist destinations',
    ],
    examples: [
      'What landmark is shown in this image?',
      'Identify this famous location.',
      'Where is this monument located?',
    ],
  },
  {
    icon: '🛍️', n: 11, title: 'Product & Brand Recognition', color: '#60A5FA',
    items: [
      'Identify products and their features',
      'Recognize logos and brands (when clearly visible)',
      'Describe product characteristics',
    ],
    examples: [
      'What product is shown in this image?',
      'Describe the features of this item.',
      'What type of product is this?',
    ],
  },
  {
    icon: '👕', n: 12, title: 'Fashion & Clothing Description', color: '#60A5FA',
    items: [
      'Describe clothing items and styles',
      'Identify fashion trends and accessories',
      'Analyze outfits and color combinations',
    ],
    examples: [
      'Describe the clothing in this image.',
      'What style of outfit is this person wearing?',
      'What accessories are visible?',
    ],
  },
  {
    icon: '🍕', n: 13, title: 'Food & Cuisine Recognition', color: '#4ADE80',
    items: [
      'Identify dishes and food items',
      'Describe ingredients and presentation',
      'Recognize cuisine types',
    ],
    examples: [
      'What food is shown in this image?',
      'Describe this dish.',
      'What type of cuisine is this?',
    ],
  },
  {
    icon: '🌳', n: 14, title: 'Nature & Wildlife Identification', color: '#4ADE80',
    items: [
      'Identify plants, flowers, and trees',
      'Recognize animals and their species',
      'Describe natural landscapes',
    ],
    examples: [
      'What type of animal is this?',
      'Identify the plants in this image.',
      'Describe this natural landscape.',
    ],
  },
  {
    icon: '🔄', n: 15, title: 'Comparison & Differences', color: '#F472B6',
    items: [
      'Compare multiple images or elements',
      'Identify similarities and differences',
      'Analyze changes or variations',
    ],
    examples: [
      'What are the main differences in this image?',
      'Compare the objects on the left and right.',
      'What has changed in this scene?',
    ],
  },
];

const CapCard = ({ icon, n, title, color, items, examples }) => (
  <div style={{
    background: KP.bg, padding: '20px 22px',
    borderRadius: '12px', border: `1px solid ${KP.border}`,
  }}>
    <h3 style={{ margin: '0 0 12px', color, fontSize: '1rem', fontWeight: 700 }}>
      {icon} {n}. {title}
    </h3>
    <ul style={{ margin: '0 0 12px', paddingLeft: '20px', lineHeight: '1.75', color: KP.muted, fontSize: '0.9rem' }}>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
    <div style={{
      background: 'rgba(91,163,217,0.06)', border: `1px solid ${KP.border}`,
      padding: '10px 14px', borderRadius: '8px', fontSize: '0.8125rem',
    }}>
      <strong style={{ color: KP.accentHi }}>Example Prompts:</strong>
      <div style={{ marginTop: '6px', color: KP.dim, lineHeight: '1.75' }}>
        {examples.map((ex, i) => <span key={i}>• "{ex}"<br /></span>)}
      </div>
    </div>
  </div>
);

const About = ({ onBack }) => (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px', fontFamily: "'Inter', -apple-system, sans-serif" }}>

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
        color: KP.accentHi, border: `1px solid rgba(91,163,217,0.30)`,
        borderRadius: '8px', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
        fontWeight: 600, fontSize: '0.875rem',
      }}>
        ← Back to Home
      </button>
    </header>

    {/* Page title */}
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '1.75rem', fontWeight: 800, color: KP.text, letterSpacing: '-0.03em' }}>
        SmolVLM-500M Capabilities
      </h2>
      <p style={{ margin: 0, color: KP.muted, fontSize: '1rem', lineHeight: 1.6 }}>
        A compact yet powerful Vision Language Model with 500 million parameters — designed for efficient on-device inference with WebGPU support.
      </p>
    </div>

    {/* Overview */}
    <div style={{
      background: KP.bg, padding: '18px 22px', borderRadius: '12px',
      borderLeft: `4px solid ${KP.accent}`, border: `1px solid rgba(91,163,217,0.28)`,
      marginBottom: '32px',
    }}>
      <h3 style={{ margin: '0 0 8px', fontSize: '1rem', color: KP.accent, fontWeight: 700 }}>Overview</h3>
      <p style={{ margin: 0, lineHeight: 1.7, color: KP.muted, fontSize: '0.9rem' }}>
        Significantly smaller than the 2.2B version while maintaining strong performance.
        Runs entirely in your browser via WebGPU — no image data ever leaves your device.
      </p>
    </div>

    {/* Capabilities grid */}
    <h2 style={{ color: KP.text, margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700 }}>Core Capabilities</h2>
    <div style={{ display: 'grid', gap: '14px', marginBottom: '36px' }}>
      {CAPABILITIES.map(cap => <CapCard key={cap.n} {...cap} />)}
    </div>

    {/* Technical Specs */}
    <div style={{ background: KP.bg, padding: '22px 24px', borderRadius: '12px', border: `1px solid ${KP.border}`, marginBottom: '20px' }}>
      <h2 style={{ color: KP.text, marginTop: 0, marginBottom: '18px', fontSize: '1.0625rem', fontWeight: 700 }}>Technical Specifications</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {[
          ['Parameters',     '500 million'],
          ['Architecture',   'Idefics3 + SmolLM2'],
          ['Vision Encoder', '93M parameters'],
          ['Visual Tokens',  '64 per 512×512 patch'],
          ['License',        'Apache 2.0'],
          ['Device',         'WebGPU (on-device)'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '0.75rem', color: KP.dim, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              {label}
            </span>
            <span style={{ fontSize: '0.9rem', color: KP.text, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Limitations */}
    <div style={{ background: KP.bg, padding: '22px 24px', borderRadius: '12px', border: '2px solid rgba(252,165,165,0.30)', marginBottom: '20px' }}>
      <h2 style={{ color: '#FCA5A5', marginTop: 0, marginBottom: '12px', fontSize: '1.0625rem', fontWeight: 700 }}>⚠️ Limitations</h2>
      <p style={{ margin: '0 0 12px', fontWeight: 600, color: KP.text, fontSize: '0.9rem' }}>What SmolVLM CANNOT Do:</p>
      <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.85', color: KP.muted, fontSize: '0.9rem' }}>
        <li>❌ Generate images (understanding only, not generation)</li>
        <li>❌ Real-time video processing</li>
        <li>❌ Perfect OCR on handwriting or tiny text</li>
        <li>❌ Face recognition (cannot identify specific individuals)</li>
        <li>❌ Medical diagnosis</li>
        <li>❌ Extremely detailed counting of small objects</li>
      </ul>
    </div>

    {/* Privacy */}
    <div style={{ background: KP.bg, padding: '22px 24px', borderRadius: '12px', border: '2px solid rgba(74,222,128,0.25)', marginBottom: '20px' }}>
      <h2 style={{ color: '#4ADE80', marginTop: 0, marginBottom: '12px', fontSize: '1.0625rem', fontWeight: 700 }}>🔒 Privacy & Security</h2>
      <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.85', color: KP.muted, fontSize: '0.9rem' }}>
        <li>✅ All inference happens in your browser with WebGPU</li>
        <li>✅ No data sent to external servers</li>
        <li>✅ Complete privacy for sensitive images</li>
        <li>✅ Works offline after initial model download</li>
        <li>✅ Model cached locally for instant future use</li>
      </ul>
    </div>

    {/* Resources */}
    <div style={{ background: KP.bg, padding: '22px 24px', borderRadius: '12px', border: `1px solid rgba(212,168,67,0.30)`, marginBottom: '36px' }}>
      <h2 style={{ color: KP.gold, marginTop: 0, marginBottom: '12px', fontSize: '1.0625rem', fontWeight: 700 }}>📚 Resources</h2>
      <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.85', fontSize: '0.9rem' }}>
        <li><a href="https://huggingface.co/HuggingFaceTB/SmolVLM-500M-Instruct" target="_blank" rel="noopener noreferrer" style={{ color: KP.accent }}>Model Card</a></li>
        <li><a href="https://huggingface.co/blog/smolvlm" target="_blank" rel="noopener noreferrer" style={{ color: KP.accent }}>Blog Post</a></li>
        <li><a href="https://huggingface.co/spaces/HuggingFaceTB/SmolVLM-256M-Demo" target="_blank" rel="noopener noreferrer" style={{ color: KP.accent }}>Demo</a></li>
        <li><a href="https://github.com/huggingface/smollm/blob/main/vision/finetuning/Smol_VLM_FT.ipynb" target="_blank" rel="noopener noreferrer" style={{ color: KP.accent }}>Fine-tuning Tutorial</a></li>
      </ul>
    </div>

    {/* Bottom back button */}
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={onBack}
        style={{
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #5BA3D9 0%, #3A7FAD 100%)',
          color: '#0A0F1E', border: 'none', borderRadius: '10px',
          cursor: 'pointer', fontFamily: "'Inter', sans-serif",
          fontWeight: 700, fontSize: '0.9375rem',
          boxShadow: '0 4px 15px rgba(91,163,217,0.38)',
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

export default About;
