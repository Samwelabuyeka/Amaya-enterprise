// Scientific Solver (prototype)
// Manages experiments, observations, and suggests next experiments using
// a simple epsilon-greedy bandit over candidate experiments.

export type Experiment = { id: string; params: Record<string, any>; outcome?: number };

const experiments: Experiment[] = [];

export function registerExperiment(exp: Experiment) {
  experiments.push(exp);
}

export function recordOutcome(id: string, outcome: number) {
  const e = experiments.find((x) => x.id === id);
  if (e) e.outcome = outcome;
}

export function proposeNext(epsilon = 0.1): Experiment | null {
  if (experiments.length === 0) return null;
  const unexplored = experiments.filter((e) => e.outcome === undefined);
  if (unexplored.length && Math.random() < 0.5) return unexplored[Math.floor(Math.random() * unexplored.length)];
  // exploit: pick best outcome
  const explored = experiments.filter((e) => e.outcome !== undefined);
  if (explored.length === 0) return experiments[Math.floor(Math.random() * experiments.length)];
  return explored.reduce((best, cur) => (cur.outcome! > (best.outcome ?? -Infinity) ? cur : best));
}

export default { registerExperiment, recordOutcome, proposeNext };
