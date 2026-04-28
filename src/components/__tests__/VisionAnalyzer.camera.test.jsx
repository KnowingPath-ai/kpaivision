/*
 * Manual test guide — run `npm start` in Chrome/Edge 113+ with WebGPU enabled:
 *
 * 1. TABS render
 *    - Load the app. Verify two pill tabs appear: "Upload Image" (active) and "Use Camera".
 *
 * 2. Upload mode (default)
 *    - Confirm the "Select Image" button is visible and the live camera is NOT shown.
 *    - Upload an image; confirm it appears as a preview and analysis starts.
 *    - Confirm the three preset-prompt buttons appear and work after upload.
 *
 * 3. Switch to Camera mode
 *    - Click "Use Camera". Browser should ask for camera permission — allow it.
 *    - Confirm the live webcam feed appears with a red "Camera active" badge.
 *    - Confirm "Capture & Analyze" button appears below the feed.
 *    - Confirm "Select Image" button is gone.
 *
 * 4. Capture & Analyze
 *    - Click "Capture & Analyze". Confirm the button text changes to "Analyzing…"
 *      while processing and a still-frame preview replaces the live feed area.
 *    - After analysis, confirm the result panel shows with the prompt used.
 *    - Confirm "Processed entirely on your device" footer is shown.
 *
 * 5. Preset prompts after capture
 *    - With a snapshot already taken, click "Identify Objects", "Extract Text",
 *      and "Analyze Mood". Each should re-run analysis on the same captured frame
 *      and display a new result without requiring a new capture.
 *
 * 6. Switch back to Upload mode
 *    - Click "Upload Image" tab. Confirm the live camera feed stops/disappears
 *      and the "Select Image" button returns.
 *
 * 7. Model not loaded (simulate by using an unsupported browser)
 *    - In a browser without WebGPU, open the app.
 *    - Switch to Camera mode. Confirm "Capture & Analyze" shows "Model not loaded"
 *      and is disabled.
 *
 * 8. Camera permission denied
 *    - Click "Use Camera" and deny the permission prompt.
 *    - Confirm an error message appears with a "Retry" button.
 */

// ─── Mock: VideoCapture ───────────────────────────────────────────────────────
// captureSnapshot is defined at module scope so the forwardRef closure can
// reference it lazily (at render time, after module initialisation).
const mockCaptureSnapshot = jest.fn();

jest.mock('../VideoCapture', () => {
  const React = require('react');
  return React.forwardRef(function MockVideoCapture({ enabled }, ref) {
    React.useImperativeHandle(ref, () => ({ captureSnapshot: mockCaptureSnapshot }));
    if (!enabled) return null;
    return React.createElement('div', { 'data-testid': 'video-capture' });
  });
});

// ─── Mock: SmolVLMModelContext ────────────────────────────────────────────────
const mockGenerate = jest.fn();
const mockApplyChatTemplate = jest.fn();
const mockBatchDecode = jest.fn();
const mockProcessorFn = jest.fn();
const mockEnsureLoaded = jest.fn();
let mockModelReady = true;

jest.mock('../../context/SmolVLMModelContext', () => ({
  SmolVLMModelProvider: ({ children }) => children,
  useSmolVLMModel: () => ({
    modelRef: { current: mockModelReady ? { generate: mockGenerate } : null },
    processorRef: { current: mockModelReady ? mockProcessorFn : null },
    modelReady: mockModelReady,
    modelLoading: false,
    modelError: null,
    ensureLoaded: mockEnsureLoaded,
  }),
}));

// ─── Imports ──────────────────────────────────────────────────────────────────
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VisionAnalyzer from '../VisionAnalyzer';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fakeBlob = new Blob(['fake-image-data'], { type: 'image/jpeg' });
const renderAnalyzer = () =>
  render(<VisionAnalyzer onShowAbout={jest.fn()} onShowSafety={jest.fn()} />);

beforeEach(() => {
  jest.clearAllMocks();
  mockModelReady = true;

  global.URL.createObjectURL = jest.fn().mockReturnValue('blob:mock-capture-url');
  global.URL.revokeObjectURL = jest.fn();

  mockCaptureSnapshot.mockResolvedValue(fakeBlob);
  mockEnsureLoaded.mockResolvedValue(true);
  mockApplyChatTemplate.mockReturnValue('mock chat text');
  mockBatchDecode.mockReturnValue(['Camera analysis result']);
  mockProcessorFn.mockResolvedValue({ input_ids: { dims: [1, 5] } });
  mockProcessorFn.apply_chat_template = mockApplyChatTemplate;
  mockProcessorFn.batch_decode = mockBatchDecode;
  mockGenerate.mockResolvedValue({ slice: jest.fn().mockReturnValue([0, 1, 2]) });
});

// ─── UI: tab rendering ────────────────────────────────────────────────────────
describe('VisionAnalyzer — camera mode UI', () => {
  test('renders "Upload Image" tab button', () => {
    renderAnalyzer();
    expect(screen.getByRole('button', { name: /upload image/i })).toBeInTheDocument();
  });

  test('renders "Use Camera" tab button', () => {
    renderAnalyzer();
    expect(screen.getByRole('button', { name: /use camera/i })).toBeInTheDocument();
  });

  test('defaults to upload mode — VideoCapture is not rendered', () => {
    renderAnalyzer();
    expect(screen.queryByTestId('video-capture')).toBeNull();
    expect(screen.getByRole('button', { name: /select image/i })).toBeInTheDocument();
  });

  test('clicking "Use Camera" renders VideoCapture', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    expect(screen.getByTestId('video-capture')).toBeInTheDocument();
  });

  test('clicking "Use Camera" shows "Capture & Analyze" button', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    expect(
      screen.getByRole('button', { name: /capture snapshot and analyze/i })
    ).toBeInTheDocument();
  });

  test('clicking "Use Camera" hides the "Select Image" button', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    expect(screen.queryByRole('button', { name: /select image/i })).toBeNull();
  });

  test('clicking "Upload Image" tab hides VideoCapture and restores Select Image', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    expect(screen.getByTestId('video-capture')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /upload image/i }));
    expect(screen.queryByTestId('video-capture')).toBeNull();
    expect(screen.getByRole('button', { name: /select image/i })).toBeInTheDocument();
  });

  test('"Capture & Analyze" is enabled when model is ready', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    expect(
      screen.getByRole('button', { name: /capture snapshot and analyze/i })
    ).not.toBeDisabled();
  });

  test('"Capture & Analyze" is disabled when model is not ready', async () => {
    mockModelReady = false;
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    expect(
      screen.getByRole('button', { name: /capture snapshot and analyze/i })
    ).toBeDisabled();
  });
});

// ─── Behaviour: capture flow ──────────────────────────────────────────────────
describe('VisionAnalyzer — capture & analyze behaviour', () => {
  test('clicking "Capture & Analyze" calls captureSnapshot on the VideoCapture ref', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /capture snapshot and analyze/i })
    );
    expect(mockCaptureSnapshot).toHaveBeenCalledTimes(1);
  });

  test('after capture, a still-frame preview image is shown', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /capture snapshot and analyze/i })
    );
    await waitFor(() =>
      expect(screen.getByRole('img', { name: /selected/i })).toBeInTheDocument()
    );
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(fakeBlob);
  });

  test('after capture, the analysis result text is displayed', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /capture snapshot and analyze/i })
    );
    await waitFor(() =>
      expect(screen.getByText('Camera analysis result')).toBeInTheDocument()
    );
  });

  test('when captureSnapshot returns null, no image preview or analysis starts', async () => {
    mockCaptureSnapshot.mockResolvedValueOnce(null);
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /capture snapshot and analyze/i })
    );
    expect(screen.queryByRole('img', { name: /selected/i })).toBeNull();
    expect(mockGenerate).not.toHaveBeenCalled();
  });
});

// ─── Behaviour: preset prompts after capture ──────────────────────────────────
describe('VisionAnalyzer — preset prompts reuse captured blob', () => {
  test('preset prompts are visible after a capture', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /capture snapshot and analyze/i })
    );
    await waitFor(() => screen.getByText('Camera analysis result'));
    expect(screen.getByRole('button', { name: /identify objects/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /extract text/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze mood/i })).toBeInTheDocument();
  });

  test('clicking a preset prompt triggers a second analysis on the same blob', async () => {
    renderAnalyzer();
    await userEvent.click(screen.getByRole('button', { name: /use camera/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /capture snapshot and analyze/i })
    );
    await waitFor(() => screen.getByText('Camera analysis result'));

    mockBatchDecode.mockReturnValueOnce(['Objects in frame']);
    await userEvent.click(screen.getByRole('button', { name: /identify objects/i }));
    await waitFor(() => screen.getByText('Objects in frame'));

    // processor called twice: once for initial capture, once for preset
    expect(mockProcessorFn).toHaveBeenCalledTimes(2);
    // captureSnapshot only called once (preset reuses the stored blob)
    expect(mockCaptureSnapshot).toHaveBeenCalledTimes(1);
  });
});
