import React, { useState, useEffect, useRef } from 'react';
import { AutoProcessor, AutoModelForVision2Seq, RawImage } from '@huggingface/transformers';

const VisionAnalyzer = ({ onShowAbout }) => {
  const modelRef = useRef(null);
  const processorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    checkWebGPU();
  }, []);

  const checkWebGPU = async () => {
    try {
      if (!navigator.gpu) {
        alert('WebGPU is not supported in your browser. Please use Chrome/Edge 113+ or enable WebGPU in chrome://flags');
        setLoading(false);
        return;
      }
      
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        alert('WebGPU adapter not found');
        setLoading(false);
        return;
      }
      
      console.log('✅ WebGPU is supported!');
      loadModel();
    } catch (error) {
      console.error('WebGPU check failed:', error);
      alert(`WebGPU error: ${error.message}`);
      setLoading(false);
    }
  };

  const loadModel = async () => {
    try {
      console.log('Starting to load SmolVLM model with WebGPU...');
      const model_id = 'HuggingFaceTB/SmolVLM-500M-Instruct';  // Using 500M - it works!
      
      console.log('Loading processor...');
      const proc = await AutoProcessor.from_pretrained(model_id, {
        progress_callback: (progress) => {
          if (progress.status === 'downloading') {
            console.log(`Downloading processor: ${progress.file} - ${Math.round(progress.progress || 0)}%`);
          }
        }
      });
      
      console.log('Loading model with WebGPU...');
      const visionModel = await AutoModelForVision2Seq.from_pretrained(model_id, {
        dtype: {
          embed_tokens: 'fp16',
          vision_encoder: 'q4',
          decoder_model_merged: 'q4',
        },
        device: 'webgpu',
        progress_callback: (progress) => {
          if (progress.status === 'downloading') {
            console.log(`Downloading model: ${progress.file} - ${Math.round(progress.progress || 0)}%`);
          }
        }
      });
      
      console.log('✅ Model loaded successfully with WebGPU!');
      processorRef.current = proc;
      modelRef.current = visionModel;
      setLoading(false);
    } catch (error) {
      console.error('Error loading model:', error);
      alert(`Failed to load model: ${error.message}\n\nMake sure you're using a WebGPU-enabled browser (Chrome/Edge 113+)`);
      setLoading(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setResult(null);
      analyzeImage(file);
    }
  };

  const analyzeImage = async (file, customPrompt = null) => {
    if (!modelRef.current || !processorRef.current) return;
    
    const model = modelRef.current;
    const processor = processorRef.current;
    
    const instruction = customPrompt || "Describe this image in detail.";
    setCurrentPrompt(instruction);
    setAnalyzing(true);
    setResult(null); // Clear previous result
    
    try {
      console.log('Loading image...');
      const image = await RawImage.fromBlob(file);
      
      console.log('Preparing chat template...');
      const messages = [
        {
          role: 'user',
          content: [
            { type: 'image' },
            { type: 'text', text: instruction }
          ]
        }
      ];
      
      const text = processor.apply_chat_template(messages, {
        add_generation_prompt: true,
      });
      
      console.log('Processing inputs...');
      const inputs = await processor(text, [image], {
        do_image_splitting: false,
      });
      
      console.log('Generating response...');
      const generatedIds = await model.generate({
        ...inputs,
        max_new_tokens: 100,
      });
      
      console.log('Decoding output...');
      const output = processor.batch_decode(
        generatedIds.slice(null, [inputs.input_ids.dims.at(-1), null]),
        { skip_special_tokens: true }
      );
      
      setResult(output[0].trim());
      console.log('✅ Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      setResult(`Error: ${error.message}`);
    }
    setAnalyzing(false);
  };

  const handlePresetPrompt = (prompt) => {
    const file = fileInputRef.current.files[0];
    if (file) {
      analyzeImage(file, prompt);
    }
  };

  return (
    <div className="vision-analyzer" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ color: '#00897B', margin: '0' }}>Privacy-First Vision AI</h1>
        <button
          onClick={onShowAbout}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: '#00897B',
            border: '2px solid #00897B',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#00897B';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#00897B';
          }}
        >
          ℹ️ About & Capabilities
        </button>
      </div>
      <p style={{ color: '#666', marginBottom: '24px' }}>Powered by SmolVLM-500M running with WebGPU in your browser</p>
      
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', background: '#FFF8E1', borderRadius: '8px', border: '2px solid #FFC107' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>Loading SmolVLM-500M model with WebGPU...</p>
          <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>First load may take 1-2 minutes. Model will be cached for instant future use. Requires Chrome/Edge 113+</p>
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={analyzing}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: analyzing ? '#ccc' : '#00BFA5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: analyzing ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
          >
            {analyzing ? 'Analyzing...' : 'Select Image'}
          </button>

          {imageUrl && (
            <div style={{ marginTop: '20px' }}>
              <img
                src={imageUrl}
                alt="Selected"
                style={{
                  maxWidth: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  display: 'block'
                }}
              />
              
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handlePresetPrompt("What objects are visible in this image?")}
                  disabled={analyzing}
                  style={{
                    padding: '8px 16px',
                    background: analyzing ? '#ccc' : '#FF7043',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  🔍 Identify Objects
                </button>
                
                <button
                  onClick={() => handlePresetPrompt("What text appears in this image?")}
                  disabled={analyzing}
                  style={{
                    padding: '8px 16px',
                    background: analyzing ? '#ccc' : '#5C6BC0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  📝 Extract Text
                </button>
                
                <button
                  onClick={() => handlePresetPrompt("Describe the mood and atmosphere of this image.")}
                  disabled={analyzing}
                  style={{
                    padding: '8px 16px',
                    background: analyzing ? '#ccc' : '#AB47BC',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  🎨 Analyze Mood
                </button>
              </div>
              
              {analyzing && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: '#E3F2FD',
                  borderRadius: '6px',
                  border: '2px solid #2196F3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid #2196F3',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1976D2', fontSize: '14px' }}>Analyzing...</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{currentPrompt}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {result && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: '#FFF8E1',
              borderRadius: '8px',
              border: '2px solid #00BFA5'
            }}>
              <h3 style={{ marginTop: '0', color: '#00897B', fontSize: '18px' }}>Analysis Result:</h3>
              {currentPrompt && (
                <div style={{
                  fontSize: '13px',
                  color: '#666',
                  fontStyle: 'italic',
                  marginBottom: '12px',
                  padding: '8px',
                  background: '#F5F5F5',
                  borderRadius: '4px',
                  borderLeft: '3px solid #00BFA5'
                }}>
                  <strong>Prompt:</strong> {currentPrompt}
                </div>
              )}
              <p style={{ fontSize: '16px', lineHeight: '1.6', margin: '0 0 12px 0', color: '#333' }}>
                {result}
              </p>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontStyle: 'italic',
                borderTop: '1px solid #ddd',
                paddingTop: '12px',
                marginTop: '12px'
              }}>
                ✓ Processed entirely on your device • Zero data sent to servers
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisionAnalyzer;
