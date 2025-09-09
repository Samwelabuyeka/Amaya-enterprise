import type { NextApiRequest, NextApiResponse } from 'next';
import { inviteBrand } from '../../../src/lib/aya/ayaManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, brandName } = req.body || {};
  if (!email || !brandName) return res.status(400).json({ error: 'email and brandName required' });
  try {
    const r = await inviteBrand(email, brandName);
    return res.status(200).json(r);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
