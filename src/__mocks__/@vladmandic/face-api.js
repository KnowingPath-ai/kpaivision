// Default auto-mock for @vladmandic/face-api (requires WebGL, unavailable in jsdom)
module.exports = {
  nets: {
    tinyFaceDetector: { loadFromUri: jest.fn().mockResolvedValue(undefined) },
    faceRecognitionNet: { loadFromUri: jest.fn().mockResolvedValue(undefined) },
  },
  TinyFaceDetectorOptions: jest.fn().mockImplementation((opts) => opts),
  detectAllFaces: jest.fn().mockReturnValue({
    withFaceDescriptors: jest.fn().mockResolvedValue([]),
  }),
};
