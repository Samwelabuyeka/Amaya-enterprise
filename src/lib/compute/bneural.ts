// Prototype bNeural substrate compute model
// This module implements a tiny, deterministic memory growth routine using
// Fibonacci-like expansion and golden-ratio weighting to produce a vector
// representing a 'neuron' state. This is a research scaffold — not a runtime.

export function goldenRatio(n: number): number {
  const phi = (1 + Math.sqrt(5)) / 2;
  return Math.pow(phi, n);
}

export function fibSequence(n: number): number[] {
  if (n <= 0) return [];
  const seq = [1, 1];
  while (seq.length < n) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  return seq.slice(0, n);
}

export function generateNeuronState(seed: string, size = 256): number[] {
  const s = Array.from(seed).map((c) => c.charCodeAt(0));
  const fib = fibSequence(size);
  const out: number[] = new Array(size);
  for (let i = 0; i < size; i++) {
    const v = (s[i % s.length] * (fib[i] || 1) * goldenRatio(i % 10)) % 1;
    out[i] = v;
  }
  return out;
}
