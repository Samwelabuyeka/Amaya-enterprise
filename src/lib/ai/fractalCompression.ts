// Simple fractal spectral compression utilities.
// Implements a DCT-based compression: compute DCT-II, keep top coefficients by magnitude, and reconstruct via IDCT.

function dct(vector: number[]) {
  const N = vector.length;
  const out = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let sum = 0;
    for (let n = 0; n < N; n++) {
      sum += vector[n] * Math.cos(Math.PI * k * (2 * n + 1) / (2 * N));
    }
    out[k] = sum * (k === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N));
  }
  return out;
}

function idct(coeffs: number[]) {
  const N = coeffs.length;
  const out = new Array(N).fill(0);
  for (let n = 0; n < N; n++) {
    let sum = 0;
    for (let k = 0; k < N; k++) {
      const ck = k === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N);
      sum += ck * coeffs[k] * Math.cos(Math.PI * k * (2 * n + 1) / (2 * N));
    }
    out[n] = sum;
  }
  return out;
}

export function compressEmbedding(embedding: number[], retainPercent = 0.1) {
  const coeffs = dct(embedding);
  const magnitudes = coeffs.map((c, i) => ({ i, v: Math.abs(c) }));
  magnitudes.sort((a, b) => b.v - a.v);
  const keep = Math.max(1, Math.floor(coeffs.length * retainPercent));
  const kept = magnitudes.slice(0, keep).map((m) => ({ index: m.i, value: coeffs[m.i] }));
  return { kept, len: coeffs.length };
}

export function decompressEmbedding(compressed: { kept: { index: number; value: number }[]; len: number }) {
  const coeffs = new Array(compressed.len).fill(0);
  for (const k of compressed.kept) coeffs[k.index] = k.value;
  return idct(coeffs);
}

export default { compressEmbedding, decompressEmbedding };
