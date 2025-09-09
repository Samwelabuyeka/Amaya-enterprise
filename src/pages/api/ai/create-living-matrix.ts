import type { NextApiRequest, NextApiResponse } from 'next';
import { createMatrixFromDNA, serializeMatrix } from '../../../lib/ai/livingMatrices';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { dna, size } = req.body || {};
  if (!dna) return res.status(400).json({ error: 'dna required' });
  const mat = createMatrixFromDNA(dna, size || 64);
  const col = collection(db, 'living_matrices');
  const d = await addDoc(col, { dna, matrix: serializeMatrix(mat), createdAt: new Date().toISOString() });
  return res.json({ ok: true, id: d.id });
}
