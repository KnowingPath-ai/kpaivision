import { RawImage } from '@huggingface/transformers';
import { SAFETY_USER_PROMPT, FALLBACK_ALERT_TEXT } from './prompts';

export async function generateSafetyAlert({ modelRef, processorRef, snapshotBlob, durationMinutes, frameCount }) {
  if (!modelRef?.current || !processorRef?.current) {
    return FALLBACK_ALERT_TEXT;
  }

  try {
    const model = modelRef.current;
    const processor = processorRef.current;
    const prompt = SAFETY_USER_PROMPT(durationMinutes, frameCount);

    const image = await RawImage.fromBlob(snapshotBlob);

    const messages = [
      {
        role: 'user',
        content: [
          { type: 'image' },
          { type: 'text', text: prompt },
        ],
      },
    ];

    const text = processor.apply_chat_template(messages, { add_generation_prompt: true });
    const inputs = await processor(text, [image], { do_image_splitting: false });

    const generatedIds = await model.generate({
      ...inputs,
      max_new_tokens: 80,
    });

    const output = processor.batch_decode(
      generatedIds.slice(null, [inputs.input_ids.dims.at(-1), null]),
      { skip_special_tokens: true }
    );

    const alertText = output[0]?.trim();
    return alertText || FALLBACK_ALERT_TEXT;
  } catch (err) {
    console.warn('SmolVLM alert generation failed, using fallback:', err.message);
    return FALLBACK_ALERT_TEXT;
  }
}
