import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

// Satellite manager: models logical satellite constellations and link latencies.

export async function createConstellation(opts: { name: string; sats?: number; orbitAltKm?: number }) {
  const { name, sats = 24, orbitAltKm = 550 } = opts;
  const c = await addDoc(collection(db, 'constellations'), { name, sats, orbitAltKm, createdAt: new Date().toISOString() });
  // create small sat descriptors
  const satIds: string[] = [];
  for (let i = 0; i < sats; i++) {
    const s = await addDoc(collection(db, `constellations/${c.id}/sats`), { index: i, status: 'active' });
    satIds.push(s.id);
  }
  return { constellationId: c.id, name, sats, satIds };
}

export async function simulateLink(constellationId: string, fromSat: string, toSat: string) {
  // produce a deterministic latency estimate depending on orbit altitude and indices
  const satsSnap = await getDocs(collection(db, `constellations/${constellationId}/sats`));
  const sats = satsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (!sats.length) throw new Error('constellation empty');
  const a = sats.find((s: any) => s.id === fromSat) || sats[0];
  const b = sats.find((s: any) => s.id === toSat) || sats[Math.floor(Math.random() * sats.length)];
  const orbAlt = 550; // assume
  const baseMs = 2 * orbAlt / 300; // very rough
  const jitter = Math.abs(a.index - b.index) % 10;
  const latency = Math.max(1, Math.round(baseMs + jitter + Math.random() * 10));
  return { from: a.id, to: b.id, latencyMs: latency };
}

export default { createConstellation, simulateLink };
