export const FACE_ENGINE_CONFIG = {
  // Model files served from jsDelivr CDN (self-host by copying to public/models/ if preferred)
  MODEL_URL: 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model',
  DETECTOR_OPTIONS: {
    inputSize: 224,       // TinyFaceDetector: 128, 160, 224, 320, 416, 608
    scoreThreshold: 0.5,
  },
  FRAME_WIDTH: 640,
  FRAME_HEIGHT: 480,
  MAX_INIT_TIMEOUT_MS: 30000,
};
