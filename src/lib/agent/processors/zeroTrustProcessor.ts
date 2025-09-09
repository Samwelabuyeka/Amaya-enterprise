import * as zt from '../security/zeroTrust';

export async function processZeroTrustStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:zerotrust\]\s*/i, '').trim();
  if (cleaned.startsWith('issue')) {
    const nodeId = cleaned.replace(/^issue\s*/i, '') || `node-${Date.now()}`;
    return { token: zt.issueToken(nodeId) };
  }
  if (cleaned.startsWith('verify')) {
    const token = cleaned.replace(/^verify\s*/i, '');
    return { nodeId: zt.verifyToken(token) };
  }
  throw new Error('unknown zerotrust command');
}

export default processZeroTrustStep;
