import type { NextApiRequest, NextApiResponse } from 'next';
import { discoverMarkets } from '../../../src/lib/aya/ayaManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { keywords } = req.body || {};
  if (!Array.isArray(keywords)) return res.status(400).json({ error: 'keywords array required' });
  try {
    const r = await discoverMarkets(keywords);
    return res.status(200).json(r);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
