import type { NextApiRequest, NextApiResponse } from 'next';
import { createCloud } from '../../../../src/lib/agent/cloud/organicCloudManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminKey = req.headers['x-agent-admin-key'] || req.query.adminKey;
  if (String(adminKey) !== process.env.AGENT_ADMIN_KEY) return res.status(403).json({ error: 'forbidden' });

  const { name, clusters, replication } = req.body || {};
  try {
    const r = await createCloud({ name, clusters, replication });
    return res.status(200).json(r);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
