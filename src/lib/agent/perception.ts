// Perception stubs (prototype). These functions are placeholders that
// normalize inputs and produce structured observations. They do not run
// heavy ML models in-process.

export type Observation = { type: string; payload: any };

export function perceiveText(text: string): Observation {
  // simple normalization
  return { type: 'text', payload: { tokens: text.split(/\s+/).slice(0, 200) } };
}

export function perceiveImageMeta(metadata: { width: number; height: number; format?: string }): Observation {
  return { type: 'image', payload: { ...metadata } };
}

export function perceiveAudioMeta(metadata: { sampleRate: number; durationSec: number }): Observation {
  return { type: 'audio', payload: metadata };
}

export default { perceiveText, perceiveImageMeta, perceiveAudioMeta };
