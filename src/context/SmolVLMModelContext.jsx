import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { AutoProcessor, AutoModelForVision2Seq } from '@huggingface/transformers';

const SmolVLMModelContext = createContext(null);

const MODEL_ID = 'HuggingFaceTB/SmolVLM-500M-Instruct';

export function SmolVLMModelProvider({ children }) {
  const modelRef = useRef(null);
  const processorRef = useRef(null);
  const [modelReady, setModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);
  const loadPromiseRef = useRef(null);

  const hasWebGPU = useCallback(async () => {
    if (!navigator.gpu) return false;
    try {
      const adapter = await navigator.gpu.requestAdapter();
      return !!adapter;
    } catch {
      return false;
    }
  }, []);

  const ensureLoaded = useCallback(async () => {
    if (modelReady) return true;
    if (loadPromiseRef.current) return loadPromiseRef.current;

    loadPromiseRef.current = (async () => {
      const gpuAvailable = await hasWebGPU();
      if (!gpuAvailable) {
        setModelError('WebGPU not available — SmolVLM alerts disabled');
        return false;
      }
      setModelLoading(true);
      setModelError(null);
      try {
        const proc = await AutoProcessor.from_pretrained(MODEL_ID);
        const model = await AutoModelForVision2Seq.from_pretrained(MODEL_ID, {
          dtype: { embed_tokens: 'fp16', vision_encoder: 'q4', decoder_model_merged: 'q4' },
          device: 'webgpu',
        });
        processorRef.current = proc;
        modelRef.current = model;
        setModelReady(true);
        setModelLoading(false);
        return true;
      } catch (err) {
        setModelError(err.message);
        setModelLoading(false);
        loadPromiseRef.current = null;
        return false;
      }
    })();

    return loadPromiseRef.current;
  }, [modelReady, hasWebGPU]);

  return (
    <SmolVLMModelContext.Provider value={{ modelRef, processorRef, modelReady, modelLoading, modelError, ensureLoaded }}>
      {children}
    </SmolVLMModelContext.Provider>
  );
}

export function useSmolVLMModel() {
  const ctx = useContext(SmolVLMModelContext);
  if (!ctx) throw new Error('useSmolVLMModel must be used within SmolVLMModelProvider');
  return ctx;
}
