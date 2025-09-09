import { compressEmbedding } from '../../ai/fractalCompression';

// mayaQPU: classical emulator inspired by quantum collapse and prime-field arithmetic.
// This is a safe, deterministic simulation that uses modular arithmetic, hashing,
// and fractal compression to produce 'collapse' like outputs for conceptual experiments.

function modPow(base: number, exp: number, mod: number) {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

export async function processMayaQpuStep(userId: string, step: string) {
  // format: [processor:mayaqpu] PRIME=<p> VECTOR=<csv> COLLAPSE=shots
  const cleaned = step.replace(/^\[processor:mayaqpu\]\s*/i, '').trim();
  const pMatch = /prime=(\d+)/i.exec(cleaned);
  const prime = pMatch ? Math.max(3, Number(pMatch[1]) | 0) : 65537;
  const vecPart = (/vector=([^|]+)/i.exec(cleaned) || [])[1] || '';
  const vec = vecPart.split(/[,\s]+/).map((s) => Number(s) || 0).slice(0, 256);
  const shots = Number((/collapse=(\d+)/i.exec(cleaned) || [])[1]) || 16;

  // map vector to residues and compute modular reductions
  const residues = vec.map((v, i) => ((Math.abs(Math.floor(v * 1e6)) + i) % prime));
  const collapsed: Record<number, number> = {};
  for (let s = 0; s < Math.min(shots, 256); s++) {
    const idx = residues[s % residues.length] % vec.length || 0;
    const seed = (residues[s % residues.length] + s) % prime;
    const sample = modPow(seed + 3, s + 7, prime);
    collapsed[idx] = (collapsed[idx] || 0) + (sample % 2);
  }

  const signature = compressEmbedding(vec.slice(0, 64).map((v) => Number(v) || 0), 0.2);
  return { prime, shots: Math.min(shots, 256), residues: residues.slice(0, 32), collapsed, signature };
}

export default processMayaQpuStep;
