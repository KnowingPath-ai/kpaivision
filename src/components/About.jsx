import React from 'react';

const About = ({ onBack }) => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <button
        onClick={onBack}
        style={{
          padding: '10px 20px',
          background: '#00BFA5',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          marginBottom: '20px',
          fontSize: '14px'
        }}
      >
        ← Back to Analyzer
      </button>

      <h1 style={{ color: '#00897B', marginBottom: '10px' }}>SmolVLM-500M-Instruct Capabilities</h1>
      
      <div style={{ background: '#E3F2FD', padding: '16px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #2196F3' }}>
        <h2 style={{ marginTop: '0', fontSize: '18px', color: '#1976D2' }}>Overview</h2>
        <p style={{ margin: '0', lineHeight: '1.6', color: '#333' }}>
          SmolVLM-500M is a compact yet powerful Vision Language Model with 500 million parameters, designed for efficient on-device inference with WebGPU support. It's significantly smaller than the 2.2B version while maintaining strong performance.
        </p>
      </div>

      <h2 style={{ color: '#00897B', marginTop: '32px', marginBottom: '16px' }}>Core Capabilities</h2>

      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Capability 1 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#FF7043', fontSize: '18px' }}>📸 1. Image Captioning & Description</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Generate detailed descriptions of images</li>
            <li>Identify main subjects and context</li>
            <li>Describe scenes, settings, and compositions</li>
          </ul>
          <div style={{ background: '#FFF3E0', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "Describe this image in detail."<br/>
              • "What is happening in this picture?"<br/>
              • "Provide a comprehensive caption for this image."
            </div>
          </div>
        </div>

        {/* Capability 2 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#FF7043', fontSize: '18px' }}>🔍 2. Object Detection & Identification</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Identify objects, people, animals, and items in images</li>
            <li>Count objects and describe their positions</li>
            <li>Recognize common items and their relationships</li>
          </ul>
          <div style={{ background: '#FFF3E0', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What objects are visible in this image?"<br/>
              • "List all the items you can see."<br/>
              • "How many people are in this photo?"
            </div>
          </div>
        </div>

        {/* Capability 3 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#5C6BC0', fontSize: '18px' }}>📝 3. Text Extraction (OCR)</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Read and extract text from images</li>
            <li>Handle printed text, signs, labels, and documents</li>
            <li>Recognize text in various fonts and sizes</li>
          </ul>
          <div style={{ background: '#E8EAF6', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What text appears in this image?"<br/>
              • "Read the text from this sign/document."<br/>
              • "Extract all visible text."
            </div>
          </div>
        </div>

        {/* Capability 4 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#5C6BC0', fontSize: '18px' }}>📄 4. Document Question Answering</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Answer questions about PDFs or scanned documents</li>
            <li>Extract information from forms, receipts, and invoices</li>
            <li>Understand document structure and layout</li>
          </ul>
          <div style={{ background: '#E8EAF6', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What is the total amount on this receipt?"<br/>
              • "Who is the sender of this document?"<br/>
              • "Summarize the key points in this document."
            </div>
          </div>
        </div>

        {/* Capability 5 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#26A69A', fontSize: '18px' }}>📊 5. Visual Reasoning</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Answer questions about charts, graphs, and diagrams</li>
            <li>Interpret data visualizations</li>
            <li>Make logical inferences from visual information</li>
          </ul>
          <div style={{ background: '#E0F2F1', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What trend does this chart show?"<br/>
              • "Explain what this diagram represents."<br/>
              • "What can you infer from this graph?"
            </div>
          </div>
        </div>

        {/* Capability 6 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#26A69A', fontSize: '18px' }}>🌍 6. Scene Understanding</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Identify locations and settings</li>
            <li>Recognize indoor vs outdoor scenes</li>
            <li>Describe environmental context</li>
          </ul>
          <div style={{ background: '#E0F2F1', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "Where was this photo taken?"<br/>
              • "What type of location is this?"<br/>
              • "Describe the environment in this image."
            </div>
          </div>
        </div>

        {/* Capability 7 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#AB47BC', fontSize: '18px' }}>🎨 7. Mood & Atmosphere Analysis</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Detect emotional tone and atmosphere</li>
            <li>Identify lighting conditions and color palettes</li>
            <li>Describe the overall feeling or mood</li>
          </ul>
          <div style={{ background: '#F3E5F5', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "Describe the mood and atmosphere of this image."<br/>
              • "What emotions does this photo convey?"<br/>
              • "What is the lighting like in this scene?"
            </div>
          </div>
        </div>

        {/* Capability 8 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#AB47BC', fontSize: '18px' }}>🌈 8. Color & Style Analysis</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Identify dominant colors</li>
            <li>Describe artistic style or photography techniques</li>
            <li>Analyze composition and visual elements</li>
          </ul>
          <div style={{ background: '#F3E5F5', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What are the main colors in this image?"<br/>
              • "Describe the artistic style of this photo."<br/>
              • "How is this image composed?"
            </div>
          </div>
        </div>

        {/* Capability 9 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#FFA726', fontSize: '18px' }}>🏃 9. Activity & Action Recognition</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Identify what people or animals are doing</li>
            <li>Describe movements and interactions</li>
            <li>Recognize sports, activities, and gestures</li>
          </ul>
          <div style={{ background: '#FFF3E0', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What activity is taking place?"<br/>
              • "What are the people doing?"<br/>
              • "Describe the action in this image."
            </div>
          </div>
        </div>

        {/* Capability 10 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#FFA726', fontSize: '18px' }}>🏛️ 10. Landmark & Famous Place Recognition</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Identify well-known landmarks and monuments</li>
            <li>Recognize famous buildings and locations</li>
            <li>Provide context about tourist destinations</li>
          </ul>
          <div style={{ background: '#FFF3E0', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What landmark is shown in this image?"<br/>
              • "Identify this famous location."<br/>
              • "Where is this monument located?"
            </div>
          </div>
        </div>

        {/* Capability 11 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#42A5F5', fontSize: '18px' }}>🛍️ 11. Product & Brand Recognition</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Identify products and their features</li>
            <li>Recognize logos and brands (when clearly visible)</li>
            <li>Describe product characteristics</li>
          </ul>
          <div style={{ background: '#E3F2FD', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What product is shown in this image?"<br/>
              • "Describe the features of this item."<br/>
              • "What type of product is this?"
            </div>
          </div>
        </div>

        {/* Capability 12 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#42A5F5', fontSize: '18px' }}>👕 12. Fashion & Clothing Description</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Describe clothing items and styles</li>
            <li>Identify fashion trends and accessories</li>
            <li>Analyze outfits and color combinations</li>
          </ul>
          <div style={{ background: '#E3F2FD', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "Describe the clothing in this image."<br/>
              • "What style of outfit is this person wearing?"<br/>
              • "What accessories are visible?"
            </div>
          </div>
        </div>

        {/* Capability 13 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#66BB6A', fontSize: '18px' }}>🍕 13. Food & Cuisine Recognition</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Identify dishes and food items</li>
            <li>Describe ingredients and presentation</li>
            <li>Recognize cuisine types</li>
          </ul>
          <div style={{ background: '#E8F5E9', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What food is shown in this image?"<br/>
              • "Describe this dish."<br/>
              • "What type of cuisine is this?"
            </div>
          </div>
        </div>

        {/* Capability 14 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#66BB6A', fontSize: '18px' }}>🌳 14. Nature & Wildlife Identification</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Identify plants, flowers, and trees</li>
            <li>Recognize animals and their species</li>
            <li>Describe natural landscapes</li>
          </ul>
          <div style={{ background: '#E8F5E9', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What type of animal is this?"<br/>
              • "Identify the plants in this image."<br/>
              • "Describe this natural landscape."
            </div>
          </div>
        </div>

        {/* Capability 15 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#EC407A', fontSize: '18px' }}>🔄 15. Comparison & Differences</h3>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Compare multiple images or elements</li>
            <li>Identify similarities and differences</li>
            <li>Analyze changes or variations</li>
          </ul>
          <div style={{ background: '#FCE4EC', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
            <strong>Example Prompts:</strong>
            <div style={{ marginTop: '6px', color: '#666' }}>
              • "What are the main differences in this image?"<br/>
              • "Compare the objects on the left and right."<br/>
              • "What has changed in this scene?"
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specs */}
      <div style={{ marginTop: '32px', background: '#F5F5F5', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#00897B', marginTop: '0', marginBottom: '16px' }}>Technical Specifications</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          <div><strong>Parameters:</strong> 500 million</div>
          <div><strong>Architecture:</strong> Idefics3 + SmolLM2</div>
          <div><strong>Vision Encoder:</strong> 93M parameters</div>
          <div><strong>Visual Tokens:</strong> 64 per 512×512 patch</div>
          <div><strong>License:</strong> Apache 2.0</div>
          <div><strong>Device:</strong> WebGPU (on-device)</div>
        </div>
      </div>

      {/* Limitations */}
      <div style={{ marginTop: '24px', background: '#FFEBEE', padding: '20px', borderRadius: '8px', border: '2px solid #EF5350' }}>
        <h2 style={{ color: '#C62828', marginTop: '0', marginBottom: '12px' }}>⚠️ Limitations</h2>
        <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>What SmolVLM CANNOT Do:</p>
        <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>❌ Generate images (understanding only, not generation)</li>
          <li>❌ Real-time video processing</li>
          <li>❌ Perfect OCR on handwriting or tiny text</li>
          <li>❌ Face recognition (cannot identify specific individuals)</li>
          <li>❌ Medical diagnosis</li>
          <li>❌ Extremely detailed counting of small objects</li>
        </ul>
      </div>

      {/* Privacy */}
      <div style={{ marginTop: '24px', background: '#E8F5E9', padding: '20px', borderRadius: '8px', border: '2px solid #66BB6A' }}>
        <h2 style={{ color: '#2E7D32', marginTop: '0', marginBottom: '12px' }}>🔒 Privacy & Security</h2>
        <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>✅ All inference happens in your browser with WebGPU</li>
          <li>✅ No data sent to external servers</li>
          <li>✅ Complete privacy for sensitive images</li>
          <li>✅ Works offline after initial model download</li>
          <li>✅ Model cached locally for instant future use</li>
        </ul>
      </div>

      {/* Resources */}
      <div style={{ marginTop: '24px', background: '#FFF9C4', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#F57F17', marginTop: '0', marginBottom: '12px' }}>📚 Resources</h2>
        <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><a href="https://huggingface.co/HuggingFaceTB/SmolVLM-500M-Instruct" target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2' }}>Model Card</a></li>
          <li><a href="https://huggingface.co/blog/smolvlm" target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2' }}>Blog Post</a></li>
          <li><a href="https://huggingface.co/spaces/HuggingFaceTB/SmolVLM-256M-Demo" target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2' }}>Demo</a></li>
          <li><a href="https://github.com/huggingface/smollm/blob/main/vision/finetuning/Smol_VLM_FT.ipynb" target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2' }}>Fine-tuning Tutorial</a></li>
        </ul>
      </div>

      <button
        onClick={onBack}
        style={{
          padding: '12px 24px',
          background: '#00BFA5',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          marginTop: '32px',
          fontSize: '16px',
          width: '100%'
        }}
      >
        ← Back to Analyzer
      </button>
    </div>
  );
};

export default About;
