import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// Simple memory store: store events, observations, and retrieved context.
export async function writeMemory(userId: string, payload: Record<string, any>) {
  const col = collection(db, 'maya_memory');
  const doc = await addDoc(col, {
    userId,
    payload,
    createdAt: new Date().toISOString(),
  });
  return { id: doc.id };
}

export async function readRecentMemory(userId: string, limitCount = 10) {
  const col = collection(db, 'maya_memory');
  const q = query(col, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function writeTrace(userId: string, trace: Record<string, any>) {
  const col = collection(db, 'maya_traces');
  const doc = await addDoc(col, {
    userId,
    trace,
    createdAt: new Date().toISOString(),
  });
  return { id: doc.id };
}

export async function pruneTraces(olderThanISO: string) {
  // Simple pruning: find traces older than timestamp and delete (Firestore delete batch omitted for brevity)
  // NOTE: Firestore batch delete not implemented here; return list of candidates.
  const col = collection(db, 'maya_traces');
  const q = query(col, orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  const candidates: any[] = [];
  snap.forEach((d) => {
    const data: any = d.data();
    if (data.createdAt < olderThanISO) candidates.push({ id: d.id, ...data });
  });
  return { candidates };
}
