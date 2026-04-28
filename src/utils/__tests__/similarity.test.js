import { cosineSimilarity, l2Norm, normalizeEmbedding } from '../similarity';

describe('l2Norm', () => {
  test('returns 1 for unit vector', () => {
    expect(l2Norm(new Float32Array([1, 0, 0]))).toBeCloseTo(1);
  });

  test('returns correct norm for [3, 4]', () => {
    expect(l2Norm(new Float32Array([3, 4]))).toBeCloseTo(5);
  });

  test('returns 0 for zero vector', () => {
    expect(l2Norm(new Float32Array([0, 0, 0]))).toBe(0);
  });
});

describe('cosineSimilarity', () => {
  test('returns 1.0 for identical vectors', () => {
    const v = new Float32Array([1, 0, 0]);
    expect(cosineSimilarity(v, v)).toBeCloseTo(1.0);
  });

  test('returns 0.0 for orthogonal vectors', () => {
    const v1 = new Float32Array([1, 0, 0]);
    const v2 = new Float32Array([0, 1, 0]);
    expect(cosineSimilarity(v1, v2)).toBeCloseTo(0.0);
  });

  test('returns -1.0 for opposite vectors', () => {
    const v1 = new Float32Array([1, 0, 0]);
    const v2 = new Float32Array([-1, 0, 0]);
    expect(cosineSimilarity(v1, v2)).toBeCloseTo(-1.0);
  });

  test('is commutative', () => {
    const v1 = new Float32Array([1, 2, 3]);
    const v2 = new Float32Array([4, 5, 6]);
    expect(cosineSimilarity(v1, v2)).toBeCloseTo(cosineSimilarity(v2, v1));
  });

  test('returns 0 for zero vector (no NaN)', () => {
    const v1 = new Float32Array([0, 0, 0]);
    const v2 = new Float32Array([1, 0, 0]);
    const result = cosineSimilarity(v1, v2);
    expect(Number.isNaN(result)).toBe(false);
    expect(result).toBe(0);
  });

  test('returns 0 for null input', () => {
    expect(cosineSimilarity(null, new Float32Array([1]))).toBe(0);
  });

  test('handles high-dimensional (128-dim) vectors', () => {
    const v1 = new Float32Array(128).fill(1);
    const v2 = new Float32Array(128).fill(1);
    expect(cosineSimilarity(v1, v2)).toBeCloseTo(1.0);
  });
});

describe('normalizeEmbedding', () => {
  test('produces unit vector', () => {
    const v = new Float32Array([3, 4, 0]);
    const normalized = normalizeEmbedding(v);
    expect(l2Norm(normalized)).toBeCloseTo(1.0);
  });

  test('returns original for zero vector', () => {
    const v = new Float32Array([0, 0, 0]);
    const result = normalizeEmbedding(v);
    expect(result).toEqual(v);
  });
});
