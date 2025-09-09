// Reality Anchors (prototype) — grounding, provenance and verifiable references
export type Anchor = { id: string; source: string; timestamp: string; evidence?: string[] };

const anchors: Map<string, Anchor> = new Map();

export function createAnchor(id: string, source: string, evidence: string[] = []) {
  const a: Anchor = { id, source, timestamp: new Date().toISOString(), evidence };
  anchors.set(id, a);
  return a;
}

export function lookupAnchor(id: string): Anchor | undefined {
  return anchors.get(id);
}

export default { createAnchor, lookupAnchor };
