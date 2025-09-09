import type { NextApiRequest, NextApiResponse } from 'next';
import { splitSecret } from '../../../../lib/crypto/shamir';
import { db } from '../../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const apiKey = req.headers['x-admin-api-key'];
  if (!apiKey || apiKey !== process.env.AGENT_ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  const { secret, shares = 5, threshold = 3 } = req.body || {};
  if (!secret) return res.status(400).json({ error: 'Missing secret' });
  const parts = splitSecret(secret, shares, threshold);
  const col = collection(db, 'maya_shards');
  const stored = [];
  for (let i = 0; i < parts.length; i++) {
    const d = await addDoc(col, { shard: parts[i], index: i, createdAt: new Date().toISOString() });
    stored.push({ id: d.id, index: i });
  }
  return res.json({ ok: true, stored });
}
