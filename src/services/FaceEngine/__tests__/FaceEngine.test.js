// NOTE: @vladmandic/face-api requires WebGL/WebGPU which is unavailable in jsdom.
// This test suite uses a full mock of the library to verify FaceEngine logic
// without GPU dependencies. Real model behavior must be validated manually.

jest.mock('@vladmandic/face-api', () => ({
  nets: {
    tinyFaceDetector: { loadFromUri: jest.fn().mockResolvedValue(undefined) },
    faceRecognitionNet: { loadFromUri: jest.fn().mockResolvedValue(undefined) },
  },
  TinyFaceDetectorOptions: jest.fn().mockImplementation((opts) => opts),
  detectAllFaces: jest.fn(),
}));

import * as faceapi from '@vladmandic/face-api';
import { initFaceEngine, isFaceEngineReady, detectFaces, resetFaceEngine } from '../index';

const mockDetection = () => ({
  detection: {
    box: { x: 100, y: 50, width: 60, height: 80 },
    score: 0.92,
  },
  descriptor: new Float32Array(128).fill(0.1),
});

beforeEach(() => {
  resetFaceEngine();
  jest.clearAllMocks();
  faceapi.detectAllFaces.mockReturnValue({
    withFaceDescriptors: jest.fn().mockResolvedValue([mockDetection()]),
  });
});

describe('initFaceEngine()', () => {
  test('loads both model nets', async () => {
    await initFaceEngine();
    expect(faceapi.nets.tinyFaceDetector.loadFromUri).toHaveBeenCalledTimes(1);
    expect(faceapi.nets.faceRecognitionNet.loadFromUri).toHaveBeenCalledTimes(1);
  });

  test('sets engine as ready after init', async () => {
    expect(isFaceEngineReady()).toBe(false);
    await initFaceEngine();
    expect(isFaceEngineReady()).toBe(true);
  });

  test('calling init twice reuses the same promise (no duplicate loads)', async () => {
    await Promise.all([initFaceEngine(), initFaceEngine()]);
    expect(faceapi.nets.tinyFaceDetector.loadFromUri).toHaveBeenCalledTimes(1);
  });

  test('throws on model load timeout', async () => {
    faceapi.nets.tinyFaceDetector.loadFromUri.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );
    // Override timeout for this test
    const { FACE_ENGINE_CONFIG } = require('../config');
    const original = FACE_ENGINE_CONFIG.MAX_INIT_TIMEOUT_MS;
    FACE_ENGINE_CONFIG.MAX_INIT_TIMEOUT_MS = 50; // 50ms timeout

    await expect(initFaceEngine()).rejects.toThrow(/timed out/i);
    FACE_ENGINE_CONFIG.MAX_INIT_TIMEOUT_MS = original;
  });
});

describe('detectFaces()', () => {
  test('throws if engine not initialized', async () => {
    await expect(detectFaces({})).rejects.toThrow(/not initialized/i);
  });

  test('returns empty array when no faces detected', async () => {
    faceapi.detectAllFaces.mockReturnValue({
      withFaceDescriptors: jest.fn().mockResolvedValue([]),
    });
    await initFaceEngine();
    const result = await detectFaces(document.createElement('video'));
    expect(result).toEqual([]);
  });

  test('returns correct FaceDetection shape', async () => {
    await initFaceEngine();
    const result = await detectFaces(document.createElement('video'));
    expect(result).toHaveLength(1);
    const det = result[0];
    expect(det.bbox).toHaveLength(4);
    expect(det.embedding).toBeInstanceOf(Float32Array);
    expect(det.embedding.length).toBe(128);
    expect(det.confidence).toBeGreaterThan(0);
    expect(typeof det.timestamp).toBe('number');
  });

  test('handles multiple faces', async () => {
    faceapi.detectAllFaces.mockReturnValue({
      withFaceDescriptors: jest.fn().mockResolvedValue([mockDetection(), mockDetection(), mockDetection()]),
    });
    await initFaceEngine();
    const result = await detectFaces(document.createElement('video'));
    expect(result).toHaveLength(3);
  });

  test('bbox values are rounded integers', async () => {
    await initFaceEngine();
    const result = await detectFaces(document.createElement('video'));
    result[0].bbox.forEach((v) => {
      expect(Number.isInteger(v)).toBe(true);
    });
  });
});

describe('resetFaceEngine()', () => {
  test('sets ready state to false after reset', async () => {
    await initFaceEngine();
    expect(isFaceEngineReady()).toBe(true);
    resetFaceEngine();
    expect(isFaceEngineReady()).toBe(false);
  });
});
