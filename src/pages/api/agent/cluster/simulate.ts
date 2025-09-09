import type { NextApiRequest, NextApiResponse } from 'next';
import { simulateGrowth, getCluster } from '../../../../src/lib/agent/clusters/clusterManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminKey = req.headers['x-agent-admin-key'] || req.query.adminKey;
  if (String(adminKey) !== process.env.AGENT_ADMIN_KEY) return res.status(403).json({ error: 'forbidden' });

  const { clusterId, steps } = req.body || {};
  try {
    const before = await getCluster(clusterId);
    const r = await simulateGrowth(clusterId, steps || 1);
    const after = await getCluster(clusterId);
    return res.status(200).json({ before, after, op: r });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
