import crypto from 'crypto';

// Living matrices: lightweight DNA-like encoded structured matrices.
// This is a software construct: a DNA string maps to deterministic block patterns.

export function dnaToSeed(dna: string) {
  return crypto.createHash('sha256').update(dna).digest();
}

export function createMatrixFromDNA(dna: string, size = 64) {
  const seed = dnaToSeed(dna);
  const mat: number[][] = Array.from({ length: size }, () => new Array(size).fill(0));
  let ptr = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const byte = seed[ptr % seed.length];
      // map byte to -1..1
      mat[r][c] = (byte / 255) * 2 - 1;
      ptr++;
    }
  }
  // apply small structured transform based on dna length
  if (dna.length % 2 === 0) {
    // make symmetric
    for (let i = 0; i < size; i++) for (let j = 0; j < i; j++) mat[i][j] = mat[j][i];
  }
  return mat;
}

export function mutateDNA(dna: string, rate = 0.01) {
  const arr = dna.split('');
  for (let i = 0; i < arr.length; i++) if (Math.random() < rate) arr[i] = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return arr.join('');
}

export function composeMatrices(mats: number[][][]) {
  if (!mats || mats.length === 0) return [];
  const n = mats[0].length;
  const out = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const m of mats) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) out[i][j] += m[i][j];
  // normalize
  const k = mats.length || 1;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) out[i][j] /= k;
  return out;
}

export function serializeMatrix(mat: number[][]) {
  return JSON.stringify(mat);
}

export function deserializeMatrix(s: string) {
  return JSON.parse(s) as number[][];
}
