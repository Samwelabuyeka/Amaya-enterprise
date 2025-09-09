import { getEmbedding } from '../lib/agent/llmAdapter';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Meta Compiler: creates numeric matrices used by agent cognition.
// L-matrix: lower-triangular connectivity derived from cosine similarity between items.
// C-matrix: correlation matrix (cosine similarity normalized).
// ABR: attention-based routing weights (softmax over similarity rows).

function dot(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) s += a[i] * b[i];
  return s;
}
function norm(a: number[]) {
  return Math.sqrt(dot(a, a)) + 1e-12;
}
function cosine(a: number[], b: number[]) {
  return dot(a, b) / (norm(a) * norm(b));
}

export async function compileMatrices(items: { id: string; text: string }[]) {
  const embeddings = [] as number[][];
  for (const it of items) {
    const emb = await getEmbedding(it.text);
    embeddings.push(emb);
  }

  const n = embeddings.length;
  const C: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = cosine(embeddings[i], embeddings[j]);
    }
  }

  // L-matrix: lower triangular of C (zero diagonal above)
  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      L[i][j] = C[i][j];
    }
  }

  // ABR: row-softmax of C (attention routing weights)
  const ABR: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    const row = C[i].slice();
    // softmax
    const max = Math.max(...row);
    const exps = row.map((v) => Math.exp(v - max));
    const sum = exps.reduce((s, x) => s + x, 0) + 1e-12;
    for (let j = 0; j < n; j++) ABR[i][j] = exps[j] / sum;
  }

  return { L, C, ABR, ids: items.map((i) => i.id) };
}

export async function compileAndStore(items: { id: string; text: string }[], meta: Record<string, any> = {}) {
  const mats = await compileMatrices(items);
  const col = collection(db, 'maya_matrices');
  const doc = await addDoc(col, { ...mats, meta, createdAt: new Date().toISOString() });
  return { id: doc.id, ...mats };
}
