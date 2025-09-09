// Zero-trust manager: issues short-lived bearer tokens and verifies them.
// Replace with real PKI, mTLS, or OIDC in production.

const TOKENS: Record<string, { nodeId: string; expiresAt: number }> = {};

export function issueToken(nodeId: string, ttlSec = 60) {
  const token = 'token_' + Math.random().toString(36).slice(2, 12);
  TOKENS[token] = { nodeId, expiresAt: Date.now() + ttlSec * 1000 };
  return token;
}

export function verifyToken(token: string) {
  const meta = TOKENS[token];
  if (!meta) return false;
  if (Date.now() > meta.expiresAt) return false;
  return meta.nodeId;
}

export default { issueToken, verifyToken };
