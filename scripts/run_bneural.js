#!/usr/bin/env node
// Simple executable version of the bNeural prototype (safe, deterministic)
function goldenRatio(n) {
  const phi = (1 + Math.sqrt(5)) / 2;
  return Math.pow(phi, n);
}

function fibSequence(n) {
  if (n <= 0) return [];
  const seq = [1, 1];
  while (seq.length < n) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  return seq.slice(0, n);
}

function generateNeuronState(seed, size = 256) {
  const s = Array.from(seed).map((c) => c.charCodeAt(0));
  const fib = fibSequence(size);
  const out = new Array(size);
  for (let i = 0; i < size; i++) {
    const v = ((s[i % s.length] * (fib[i] || 1) * goldenRatio(i % 10)) % 1);
    out[i] = v;
  }
  return out;
}

const seed = process.argv[2] || 'amaya-seed';
console.log('Generating neuron state for seed:', seed);
const vec = generateNeuronState(seed, 64);
console.log('State vector (first 16 elements):', vec.slice(0, 16));
