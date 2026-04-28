import { FACE_ENGINE_CONFIG } from './config';

// face-api is loaded lazily via dynamic import to:
// 1. Prevent TFjs from initializing at page load and competing for WebGPU with
//    @huggingface/transformers (which uses onnxruntime-web's WebGPU backend).
// 2. Force TFjs to use WebGL — the two WebGPU runtimes are incompatible.

let faceapiModule = null;
let initPromise = null;
let engineReady = false;

async function loadFaceAPI() {
  if (faceapiModule) return faceapiModule;
  faceapiModule = await import('@vladmandic/face-api');
  // Explicitly use WebGL so TFjs doesn't compete with onnxruntime-web for WebGPU
  if (faceapiModule.tf) {
    await faceapiModule.tf.setBackend('webgl');
    await faceapiModule.tf.ready();
  }
  return faceapiModule;
}

export async function initFaceEngine() {
  if (engineReady) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Face model load timed out')), FACE_ENGINE_CONFIG.MAX_INIT_TIMEOUT_MS)
    );
    await Promise.race([
      (async () => {
        const faceapi = await loadFaceAPI();
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(FACE_ENGINE_CONFIG.MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(FACE_ENGINE_CONFIG.MODEL_URL),
        ]);
      })(),
      timeout,
    ]);
    engineReady = true;
  })();

  return initPromise;
}

export function isFaceEngineReady() {
  return engineReady;
}

export async function detectFaces(videoOrCanvas) {
  if (!engineReady || !faceapiModule) throw new Error('FaceEngine not initialized');

  const faceapi = faceapiModule;
  const options = new faceapi.TinyFaceDetectorOptions(FACE_ENGINE_CONFIG.DETECTOR_OPTIONS);
  const detections = await faceapi
    .detectAllFaces(videoOrCanvas, options)
    .withFaceDescriptors();

  const timestamp = Date.now();
  return detections.map((d) => ({
    bbox: [
      Math.round(d.detection.box.x),
      Math.round(d.detection.box.y),
      Math.round(d.detection.box.width),
      Math.round(d.detection.box.height),
    ],
    embedding: new Float32Array(d.descriptor),
    confidence: d.detection.score,
    timestamp,
  }));
}

export function resetFaceEngine() {
  engineReady = false;
  initPromise = null;
  faceapiModule = null;
}
