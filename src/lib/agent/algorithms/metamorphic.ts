// Metamorphic algorithms scaffold: choose algorithmic strategies and morph parameters
// based on environment metrics. This is a lightweight orchestrator for strategy switching.

export type Strategy = 'round_robin' | 'weighted' | 'random' | 'fractal';

export function chooseStrategy(metrics: { latency?: number; errorRate?: number; load?: number }) {
  const { latency = 10, errorRate = 0, load = 0.5 } = metrics;
  if (errorRate > 0.1) return 'fractal';
  if (latency > 200) return 'round_robin';
  if (load > 0.8) return 'weighted';
  return 'random';
}

export function morphParameters(strategy: Strategy, metrics: any) {
  // produce small config object per strategy
  if (strategy === 'round_robin') return { window: Math.max(1, Math.floor((metrics.latency || 10) / 10)) };
  if (strategy === 'weighted') return { weights: metrics.nodeScores || [] };
  if (strategy === 'fractal') return { depth: Math.min(8, Math.floor((metrics.errorRate || 0) * 100)) };
  return { randomness: Math.min(1, metrics.load || 0.5) };
}

export default { chooseStrategy, morphParameters };
