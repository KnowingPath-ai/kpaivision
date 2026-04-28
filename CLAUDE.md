# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SmolVLM Vision App** is a privacy-first web application that runs the SmolVLM-500M vision language model directly in the browser using WebGPU. All image processing happens locally with zero data sent to servers.

- **Model**: SmolVLM-500M-Instruct (500M parameters)
- **Deployment**: React app via Netlify
- **Key Feature**: On-device inference with WebGPU for complete privacy

## Development Commands

### Setup
```bash
npm install
```

### Local Development
```bash
npm start
```
- Runs dev server at `http://localhost:3000`
- Requires Chrome/Edge 113+ with WebGPU enabled
- Hot reload enabled

### Building for Production
```bash
npm run build
```
- Uses CRACO to handle custom webpack configuration
- Outputs to `build/` directory
- Netlify automatically deploys from this folder

### Testing
```bash
npm test
```
- Launches test runner in interactive watch mode

## Architecture

### Component Structure
- **App.js** - Page router managing `analyzer` vs `about` views
- **VisionAnalyzer.jsx** - Main UI component handling:
  - WebGPU availability check
  - Model loading (AutoProcessor + AutoModelForVision2Seq)
  - Image input and analysis
  - Result display
- **About.jsx** - Information page describing SmolVLM capabilities (15 different vision tasks)

### Model Loading Flow
1. Browser checks WebGPU support (`navigator.gpu`)
2. Requests GPU adapter
3. Loads processor from HuggingFace
4. Loads model with quantization (fp16 tokens, q4 vision/decoder)
5. Model cached in browser for instant future use

### Analysis Flow
1. User selects image (via file input)
2. Image loaded as Blob and converted to RawImage
3. Chat template applied with instruction/prompt
4. Processor prepares inputs with image splitting disabled
5. Model generates response (max 100 tokens)
6. Processor decodes output and displays

### Key State Management (VisionAnalyzer)
- `modelRef` / `processorRef` - Stores loaded HF transformers
- `loading` - Initial model loading state
- `analyzing` - During inference
- `result` - Last analysis output
- `imageUrl` - Current image preview URL
- `currentPrompt` - The prompt that was used for analysis

## Build Configuration

### Webpack Customization (craco.config.js)
The project uses CRACO to work around bundling issues with `@huggingface/transformers` and `onnxruntime-web`:

- **Resolve Fallbacks**: Disabled `fs`, `path`, `crypto` (browser-incompatible modules)
- **Ignore Warnings**: Suppresses known dependency expression warnings from transformers
- **WASM Handling**: `.wasm` files treated as `asset/resource` instead of being parsed
- **Onnxruntime Alias**: Explicitly resolves `onnxruntime-web` path to avoid bundling errors

### Dev Server Headers (craco.config.js)
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```
Required for WebGPU to function in shared-context isolation.

### Netlify Deployment (netlify.toml)
- Build command: `npm run build`
- Publish directory: `build/`
- Node version: 22
- `CI=false` to prevent warnings from failing build
- Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Cache-Control for static assets: 1 year immutable

## Key Dependencies

### Critical
- `@huggingface/transformers` ^3.1.2 - Loads and runs SmolVLM model in browser
- `react` ^18.3.1 - UI framework (pinned to v18 for compatibility)
- `react-scripts` 5.0.1 - CRA build tools
- `@craco/craco` ^7.1.0 - Webpack customization layer

### Important
- WebGPU is a browser requirement (not npm), requires Chrome/Edge 113+
- Model inference depends on ONNX Runtime via transformers library

## Common Workflows

### Running a Single Test
```bash
npm test -- ComponentName.test.js --testNamePattern="test name"
```

### Debugging Model Loading Issues
- Check browser console for detailed model download progress
- Verify WebGPU support: `navigator.gpu` should exist
- Common issues:
  - Wrong browser version (need Chrome/Edge 113+)
  - WASM bundling failures (handled by craco config)
  - Network timeouts during model download (model is ~200-300MB with quantization)

### Adding a New Analysis Feature
1. Add preset prompt button in VisionAnalyzer around line 233
2. Create new handler calling `handlePresetPrompt()`
3. Add capability description to About.jsx
4. Update SMOLVLM_CAPABILITIES.md if new task type

### Deploying to Netlify
- Commits to `main` automatically trigger builds via Netlify CI
- Deployment uses Node 22 as configured in netlify.toml
- Review build logs if deployment fails (check webpack/CRACO output for bundling errors)

## Known Constraints

### Browser Limitations
- **WebGPU required** - Only modern Chrome/Edge/Opera
- **Model size** - First load downloads ~200-300MB, takes 1-2 minutes
- **Memory** - Quantization (fp16/q4) keeps RAM footprint low but still requires dedicated GPU
- **Privacy** - Deliberately no telemetry or server-side processing

### Model Limitations (See SMOLVLM_CAPABILITIES.md)
- Cannot generate images (understanding only)
- Struggles with handwriting and very small text
- No face recognition or medical diagnosis
- Approximate counts for large numbers of small objects

## Recent Build Fixes

The project has special webpack configuration due to bundling challenges:
- WASM files from onnxruntime-web were being parsed (fixed with `asset/resource` rule)
- Critical dependency warnings from transformers are suppressed
- Module resolution for onnxruntime-web is aliased to prevent bundling duplication

If you encounter new bundling errors, check the craco.config.js webpack configuration first.

## Testing Notes

- App uses `@testing-library/react` for component tests
- setupTests.js handles test environment configuration
- Main component (VisionAnalyzer) is complex with async model loading - integration tests are more valuable than unit tests for this component
