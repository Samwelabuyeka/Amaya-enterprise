import type { NextApiRequest, NextApiResponse } from 'next';
import { listRecords } from '../../../../src/lib/agent/forensics/forensicLedger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const adminKey = req.headers['x-agent-admin-key'] || req.query.adminKey;
  if (String(adminKey) !== process.env.AGENT_ADMIN_KEY) return res.status(403).json({ error: 'forbidden' });
  const ledgerId = String(req.query.ledgerId || '');
  try {
    const r = await listRecords(ledgerId);
    return res.status(200).json(r);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
