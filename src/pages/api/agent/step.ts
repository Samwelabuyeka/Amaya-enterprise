import { NextApiRequest, NextApiResponse } from 'next';
import { executeStep } from '../../../src/lib/agent/agentOrchestrator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { step } = req.body || {};
  const userId = req.headers['x-user-id'];
  if (!userId || typeof userId !== 'string') return res.status(401).json({ error: 'Missing X-User-Id header' });
  if (!step) return res.status(400).json({ error: 'Missing step' });

  try {
    const out = await executeStep(userId, step);
    res.json({ result: out });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
}
