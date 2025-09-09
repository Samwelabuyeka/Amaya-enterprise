import crypto from 'crypto';

export function sha256Hex(input: Buffer | string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function merkleRootHex(hashes: string[]) {
  if (!hashes || hashes.length === 0) return '';
  let level = hashes.slice();
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const a = level[i];
      const b = i + 1 < level.length ? level[i + 1] : level[i];
      const combined = Buffer.concat([Buffer.from(a, 'hex'), Buffer.from(b, 'hex')]);
      next.push(sha256Hex(combined));
    }
    level = next;
  }
  return level[0];
}

export default { sha256Hex, merkleRootHex };
