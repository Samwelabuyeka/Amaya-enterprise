import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const neuronUrl = process.env.NEURON_MANAGER_URL;
  if (!neuronUrl) return res.status(500).json({ error: 'NEURON_MANAGER_URL not configured' });
  try {
    const r = await globalThis.fetch(`${neuronUrl.replace(/\/$/, '')}/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const j = await r.json();
    return res.json(j);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
