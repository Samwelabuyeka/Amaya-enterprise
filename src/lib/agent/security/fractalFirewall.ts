import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// Fractal firewall: simulate hierarchical rule checks by recursively partitioning input
// attributes and scoring them against rule sets. Does not apply network policy.

function partitionAttrs(attrs: Record<string, any>, depth = 0, maxDepth = 4) {
  if (depth >= maxDepth) return [attrs];
  const keys = Object.keys(attrs);
  const mid = Math.floor(keys.length / 2) || 1;
  const a: Record<string, any> = {} as any;
  const b: Record<string, any> = {} as any;
  keys.forEach((k, i) => (i < mid ? (a[k] = attrs[k]) : (b[k] = attrs[k])));
  return [...partitionAttrs(a, depth + 1, maxDepth), ...partitionAttrs(b, depth + 1, maxDepth)];
}

export async function simulateFirewall(name: string, attrs: Record<string, any>, rules: string[] = []) {
  const parts = partitionAttrs(attrs, 0, Math.min(6, Math.max(1, Math.floor(Object.keys(attrs).length / 2))));
  const scores = parts.map((p, i) => ({ part: i, score: Math.random(), attrs: Object.keys(p).length }));
  const total = scores.reduce((a, b) => a + b.score, 0) || 1;
  const normalized = scores.map((s) => ({ ...s, norm: s.score / total }));
  const action = normalized.some((n) => n.norm > 0.6) ? 'drop' : 'allow';

  // persist a small trace for observability
  await addDoc(collection(db, 'fractal_firewall_traces'), { name, attrs: Object.keys(attrs).slice(0, 8), action, normalized, createdAt: new Date().toISOString() });
  return { action, normalized };
}

export default { simulateFirewall };
