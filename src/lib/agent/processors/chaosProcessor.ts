import { dct, idct } from '../../ai/fractalCompression';

// Chaos processor: applies bounded chaotic maps (logistic map) to a numeric vector
// and returns fractalized compressed descriptors. Safe and purely numerical.

function logisticMap(x: number, r = 3.9) {
  return r * x * (1 - x);
}

export async function processChaosStep(userId: string, step: string) {
  // format: [processor:chaos] VECTOR <comma separated numbers> | iterations=100 | r=3.9
  const cleaned = step.replace(/^\[processor:chaos\]\s*/i, '').trim();
  const parts = cleaned.split('|').map((s) => s.trim());
  const vec = (parts[0] || '').replace(/^vector\s*/i, '').split(/[,\s]+/).map((s) => Number(s) || 0).slice(0, 1024);
  const iterations = Number((/iterations=(\d+)/i.exec(cleaned) || [])[1]) || 50;
  const r = Number((/r=([0-9.]+)/i.exec(cleaned) || [])[1]) || 3.9;

  let x = vec.length ? vec[0] : Math.random();
  const trajectory: number[] = [];
  for (let i = 0; i < Math.min(iterations, 1000); i++) {
    x = logisticMap(x, r);
    trajectory.push(x);
  }

  // compress a small signature using DCT
  const sig = dct(trajectory.slice(0, 64));
  return { trajectory: trajectory.slice(0, 32), signature: sig.slice(0, 16) };
}

export default processChaosStep;
