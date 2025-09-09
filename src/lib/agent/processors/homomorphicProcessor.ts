import * as he from '../crypto/homomorphic';

export async function processHomomorphicStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:homomorphic\]\s*/i, '').trim();
  // format: encrypt n | add a b | decrypt c
  if (cleaned.startsWith('encrypt')) {
    const n = Number(cleaned.replace(/^encrypt\s*/i, '')) || 0;
    return { cipher: he.encryptNumber(n) };
  }
  if (cleaned.startsWith('add')) {
    const parts = cleaned.replace(/^add\s*/i, '').split(/\s+/).map((s) => Number(s));
    return { sum: he.addEncrypted(parts[0] || 0, parts[1] || 0) };
  }
  if (cleaned.startsWith('decrypt')) {
    const c = Number(cleaned.replace(/^decrypt\s*/i, '')) || 0;
    return { plain: he.decryptNumber(c) };
  }
  throw new Error('unknown homomorphic command');
}

export default processHomomorphicStep;
