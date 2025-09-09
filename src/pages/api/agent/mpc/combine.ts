import type { NextApiRequest, NextApiResponse } from 'next';
import { combineShares } from '../../../../lib/crypto/shamir';
import { db } from '../../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const apiKey = req.headers['x-admin-api-key'];
  if (!apiKey || apiKey !== process.env.AGENT_ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  const { shardIds } = req.body || {};
  if (!Array.isArray(shardIds) || shardIds.length === 0) return res.status(400).json({ error: 'Provide shardIds' });
  const parts: string[] = [];
  for (const id of shardIds) {
    const d = await getDoc(doc(db, 'maya_shards', id));
    if (!d.exists()) return res.status(404).json({ error: `Shard ${id} not found` });
    const data: any = d.data();
    parts.push(data.shard);
  }
  try {
    const secret = combineShares(parts);
    return res.json({ ok: true, secret });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
