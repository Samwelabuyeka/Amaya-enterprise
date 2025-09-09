import * as zkp from '../crypto/zkp';

export async function processZkpStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:zkp\]\s*/i, '').trim();
  // format: [processor:zkp] gen|verify json...
  if (cleaned.startsWith('gen')) {
    const payload = JSON.parse(cleaned.replace(/^gen\s*/i, '') || '{}');
    return await zkp.generateProof(payload.statement || {}, payload.witness || {});
  }
  if (cleaned.startsWith('verify')) {
    const payload = JSON.parse(cleaned.replace(/^verify\s*/i, '') || '{}');
    return await zkp.verifyProof(payload.statement, payload.proof);
  }
  throw new Error('unknown zkp command');
}

export default processZkpStep;
