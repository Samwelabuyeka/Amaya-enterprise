// RLHF (prototype scaffolding)
// This module provides an auditable, non-executing scaffold to collect trajectories,
// compute rewards, and produce training batches for a reward model. It is intended
// as a safe research scaffold and does not train models in-process.

export type Trajectory = {
  id: string;
  prompt: string;
  response: string;
  reward?: number;
  metadata?: Record<string, any>;
};

const store: Map<string, Trajectory> = new Map();

export function recordTrajectory(t: Trajectory) {
  store.set(t.id, t);
}

export function scoreWithHeuristic(t: Trajectory): number {
  // Prototype reward: length + heuristic quality score
  const lenScore = Math.min(1, t.response.length / 500);
  const clarity = /\.|\n/.test(t.response) ? 0.5 : 0.2;
  return Math.round((lenScore + clarity) * 50) / 100; // 0..1 approx
}

export function prepareBatch(batchSize = 8) {
  const items = Array.from(store.values()).slice(0, batchSize);
  return items.map((t) => ({ prompt: t.prompt, response: t.response, reward: t.reward ?? scoreWithHeuristic(t) }));
}

export function clearStore() {
  store.clear();
}

export default { recordTrajectory, prepareBatch, scoreWithHeuristic, clearStore };
