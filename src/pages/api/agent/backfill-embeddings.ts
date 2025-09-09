import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getEmbedding } from '../../../src/lib/agent/llmAdapter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // basic auth for safety
  const apiKey = req.headers['x-admin-api-key'];
  if (!apiKey || apiKey !== process.env.AGENT_ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const brandsSnap = await getDocs(collection(db, 'brands'));
    for (const b of brandsSnap.docs) {
      const data: any = b.data();
      const text = `${data.name || ''} ${data.description || ''}`;
      const emb = await getEmbedding(text);
      await updateDoc(doc(db, 'brands', b.id), { embedding: emb as any } as any);
    }
    const productsSnap = await getDocs(collection(db, 'products'));
    for (const p of productsSnap.docs) {
      const data: any = p.data();
      const text = `${data.name || ''} ${data.desc || data.description || ''}`;
      const emb = await getEmbedding(text);
      await updateDoc(doc(db, 'products', p.id), { embedding: emb as any } as any);
    }
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
