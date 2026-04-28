// NOTE: @huggingface/transformers requires WebGPU. All calls are mocked here.
// Manual testing required for real model behavior (see manual test plan).

import { generateSafetyAlert } from '../SmolVLMClient';
import { FALLBACK_ALERT_TEXT } from '../prompts';

jest.mock('@huggingface/transformers', () => ({
  RawImage: {
    fromBlob: jest.fn().mockResolvedValue({ data: new Uint8Array(100) }),
  },
  AutoProcessor: { from_pretrained: jest.fn() },
  AutoModelForVision2Seq: { from_pretrained: jest.fn() },
}));

function makeModelRef(generateResult = ['Test alert response']) {
  const processor = {
    apply_chat_template: jest.fn().mockReturnValue('mock prompt text'),
    batch_decode: jest.fn().mockReturnValue(generateResult),
  };
  const processorRef = { current: processor };

  const model = {
    generate: jest.fn().mockResolvedValue({
      slice: jest.fn().mockReturnValue('slice-result'),
    }),
  };
  // Make inputs.input_ids.dims accessible
  processor._mockInputs = { input_ids: { dims: [1, 10] } };
  processor.__call = jest.fn().mockResolvedValue({ input_ids: { dims: [1, 10] } });

  const modelRef = { current: model };

  // Override processor to be callable (it's called as a function in the client)
  const callableProcessor = Object.assign(
    jest.fn().mockResolvedValue({ input_ids: { dims: [1, 10] } }),
    processor
  );
  processorRef.current = callableProcessor;

  return { modelRef, processorRef };
}

describe('generateSafetyAlert()', () => {
  test('returns fallback text when modelRef is null', async () => {
    const result = await generateSafetyAlert({
      modelRef: { current: null },
      processorRef: { current: null },
      snapshotBlob: new Blob([''], { type: 'image/jpeg' }),
      durationMinutes: 10,
      frameCount: 20,
    });
    expect(result).toBe(FALLBACK_ALERT_TEXT);
  });

  test('returns fallback text when snapshotBlob causes error', async () => {
    const { RawImage } = require('@huggingface/transformers');
    RawImage.fromBlob.mockRejectedValueOnce(new Error('invalid image'));

    const { modelRef, processorRef } = makeModelRef();
    const result = await generateSafetyAlert({
      modelRef,
      processorRef,
      snapshotBlob: new Blob(['bad'], { type: 'image/jpeg' }),
      durationMinutes: 5,
      frameCount: 10,
    });
    expect(result).toBe(FALLBACK_ALERT_TEXT);
  });

  test('returns fallback when model.generate throws', async () => {
    const { RawImage } = require('@huggingface/transformers');
    RawImage.fromBlob.mockResolvedValue({});

    const processor = Object.assign(
      jest.fn().mockResolvedValue({ input_ids: { dims: [1, 10] } }),
      { apply_chat_template: jest.fn().mockReturnValue(''), batch_decode: jest.fn() }
    );
    const model = { generate: jest.fn().mockRejectedValue(new Error('GPU OOM')) };

    const result = await generateSafetyAlert({
      modelRef: { current: model },
      processorRef: { current: processor },
      snapshotBlob: new Blob([''], { type: 'image/jpeg' }),
      durationMinutes: 5,
      frameCount: 10,
    });
    expect(result).toBe(FALLBACK_ALERT_TEXT);
  });
});

describe('FALLBACK_ALERT_TEXT', () => {
  test('is a non-empty string', () => {
    expect(typeof FALLBACK_ALERT_TEXT).toBe('string');
    expect(FALLBACK_ALERT_TEXT.length).toBeGreaterThan(20);
  });

  test('does not contain alarming language', () => {
    const alarming = ['danger', 'emergency', 'threat', 'criminal', 'attack'];
    alarming.forEach((word) => {
      expect(FALLBACK_ALERT_TEXT.toLowerCase()).not.toContain(word);
    });
  });
});
