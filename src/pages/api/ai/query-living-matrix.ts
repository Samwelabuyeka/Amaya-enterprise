import type { NextApiRequest, NextApiResponse } from 'next';
import { deserializeMatrix, composeMatrices, mutateDNA, createMatrixFromDNA } from '../../../lib/ai/livingMatrices';
import { db } from '../../../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, action } = req.query as any;
  if (!id) {
    // list
    const snap = await getDocs(collection(db, 'living_matrices'));
    return res.json({ ok: true, items: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
  }
  const dref = doc(db, 'living_matrices', id as string);
  const snap = await getDoc(dref);
  if (!snap.exists()) return res.status(404).json({ error: 'not found' });
  const data: any = snap.data();
  if (action === 'mutate') {
    const newDna = mutateDNA(data.dna, 0.05);
    const newMat = createMatrixFromDNA(newDna, Math.sqrt(JSON.parse(data.matrix).length || 64));
    return res.json({ ok: true, newDna, matrixSample: newMat[0].slice(0,5) });
  }
  return res.json({ ok: true, data: { dna: data.dna, matrixSample: JSON.parse(data.matrix)[0].slice(0,5) } });
}
