export const SAFETY_USER_PROMPT = (durationMinutes, frameCount) =>
  `A person has appeared approximately ${frameCount} times over the past ${Math.round(durationMinutes)} minutes in this location. ` +
  `Looking at this image, is there anything about this person's behavior or context that seems unusual or potentially concerning? ` +
  `Please describe only what you can observe. Keep your response to 2-3 sentences and end with a practical suggestion.`;

export const FALLBACK_ALERT_TEXT =
  'Someone appears to have been present in this area multiple times over the past several minutes. ' +
  'Please check whether this is expected. If you feel concerned, trust your instincts and take appropriate action.';

export const SAFETY_SYSTEM_NOTE =
  'You are a helpful safety assistant. Respond calmly and avoid alarming language. ' +
  'Do not attempt to identify individuals. Focus only on observable behavior and context. ' +
  'If nothing appears concerning, say so clearly.';
