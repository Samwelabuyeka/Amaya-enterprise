import type { NextApiRequest, NextApiResponse } from 'next';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { compileAndStore } from '../../../lib/ai/metaCompiler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.headers['x-admin-api-key'];
  if (!apiKey || apiKey !== process.env.AGENT_ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const brandsSnap = await getDocs(collection(db, 'brands'));
    const productsSnap = await getDocs(collection(db, 'products'));
    const items: any[] = [];
    brandsSnap.forEach((d) => items.push({ id: 'brand:' + d.id, text: (d.data() as any).name + ' ' + (d.data() as any).description }));
    productsSnap.forEach((d) => items.push({ id: 'product:' + d.id, text: (d.data() as any).name + ' ' + ((d.data() as any).desc || (d.data() as any).description || '') }));
    const out = await compileAndStore(items, { source: 'brands-products' });
    return res.json(out);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
