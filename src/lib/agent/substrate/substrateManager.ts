import { collection, addDoc, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { evaluateGodelStatement } from '../engines/godelEngine';

// Substrate manager: represents a logical substrate (multistate neurons + rules)
// Persisted as metadata and small samples. All execution is strictly bounded to avoid
// unbounded recursion or resource exhaustion.

const MAX_DEPTH = 64; // enforce a strict recursion limit

export async function createSubstrate(opts: { name: string; states?: number; rules?: string[]; seed?: string }) {
  const { name, states = 3, rules = [], seed } = opts;
  const substratesCol = collection(db, 'substrates');
  const docRef = await addDoc(substratesCol, {
    name,
    states,
    rules,
    seed: seed ?? null,
    createdAt: new Date().toISOString(),
  });
  return { substrateId: docRef.id, name, states };
}

export async function getSubstrate(id: string) {
  const d = await getDoc(doc(db, 'substrates', id));
  if (!d.exists()) throw new Error('substrate not found');
  return { id: d.id, ...d.data() };
}

export async function runSubstrate(id: string, entry: string, steps = 1, maxDepth = MAX_DEPTH) {
  if (steps < 1) throw new Error('steps must be >= 1');
  if (maxDepth > MAX_DEPTH) maxDepth = MAX_DEPTH;

  const substrate = await getSubstrate(id);
  const traces: any[] = [];

  // execute bounded steps; each step yields a trace
  for (let s = 0; s < steps; s++) {
    const depth = Math.min(maxDepth, MAX_DEPTH);
    const evalResult = await evaluateGodelStatement(substrate, entry, depth);
    traces.push({ step: s + 1, input: entry, result: evalResult, timestamp: new Date().toISOString() });
    // small mutation: append a token from result to entry to allow evolving recursion
    entry = String(entry).slice(0, 256) + '|' + String(evalResult.summary || evalResult.outcome || '').slice(0, 128);
  }

  // persist a small run record
  await addDoc(collection(db, `substrates/${id}/runs`), { entry, traces, createdAt: new Date().toISOString() });

  return { substrateId: id, steps, traces };
}

export default { createSubstrate, getSubstrate, runSubstrate };
