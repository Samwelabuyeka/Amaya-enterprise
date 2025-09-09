import { NextApiRequest, NextApiResponse } from 'next';
import { startAgent } from '../../../src/lib/agent/agentOrchestrator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { task } = req.body || {};
  // quick auth: expect X-User-Id header
  const userId = req.headers['x-user-id'];
  if (!userId || typeof userId !== 'string') return res.status(401).json({ error: 'Missing X-User-Id header' });
  if (!task) return res.status(400).json({ error: 'Missing task' });

  try {
    const out = await startAgent(userId, task);
    res.json(out);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
}
