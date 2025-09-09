// Paradox Engines (prototype)
// Lightweight scaffold to represent and reason about conflicting beliefs
// and paradoxical constraints using confidence scores.

export type Belief = { id: string; statement: string; confidence: number }; // 0..1

export type ParadoxNode = {
  id: string;
  beliefs: Belief[];
  resolved?: boolean;
  resolution?: string;
};

export function createParadox(id: string, beliefs: Belief[]): ParadoxNode {
  return { id, beliefs };
}

export function resolveParadox(node: ParadoxNode): ParadoxNode {
  // Prototype resolution: pick the belief with highest confidence, but
  // if two top confidences are near-equal, mark as unresolved with options.
  const sorted = [...node.beliefs].sort((a, b) => b.confidence - a.confidence);
  if (sorted.length < 2) {
    node.resolved = true;
    node.resolution = sorted[0]?.statement || 'no-belief';
    return node;
  }
  const top = sorted[0];
  const second = sorted[1];
  if (Math.abs(top.confidence - second.confidence) < 0.05) {
    node.resolved = false;
    node.resolution = `ambiguous: ${top.statement} | ${second.statement}`;
  } else {
    node.resolved = true;
    node.resolution = top.statement;
  }
  return node;
}

export default { createParadox, resolveParadox };
