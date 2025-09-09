// Mythios Layer (prototype)
// A meta-symbolic orchestration layer that tracks high-level plans,
// narrative threads, and symbolic mappings. This is intentionally a
// lightweight, auditable representation (no self-modifying code).

export type SymbolicFact = {
  id: string;
  symbol: string;
  value: any;
  provenance?: string[];
};

const facts: Map<string, SymbolicFact> = new Map();

export function assertFact(f: SymbolicFact) {
  facts.set(f.id, f);
}

export function queryBySymbol(symbol: string): SymbolicFact[] {
  return Array.from(facts.values()).filter((f) => f.symbol === symbol);
}

export function listFacts(): SymbolicFact[] {
  return Array.from(facts.values());
}

export function provenance(id: string): string[] {
  return facts.get(id)?.provenance || [];
}

export default { assertFact, queryBySymbol, listFacts, provenance };
