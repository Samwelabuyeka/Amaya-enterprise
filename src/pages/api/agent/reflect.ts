import { NextApiRequest, NextApiResponse } from 'next';
import { reflectAgent } from '../../../src/lib/agent/agentOrchestrator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });
  const userId = req.headers['x-user-id'];
  if (!userId || typeof userId !== 'string') return res.status(401).json({ error: 'Missing X-User-Id header' });

  try {
    const out = await reflectAgent(userId);
    res.json({ reflection: out });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
}
