import type { NextApiRequest, NextApiResponse } from 'next';
import { getEmbedding } from '../../../lib/agent/llmAdapter';
import { db } from '../../../lib/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

const FAISS_URL = process.env.FAISS_URL || 'http://localhost:8002';

// very small rate limit per IP in memory (for demo)
const RATE_LIMIT: Record<string, { last: number; count: number }> = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { q, k = 10 } = req.body || {};
  if (!q) return res.status(400).json({ error: 'Missing query q' });

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local';
  const now = Date.now();
  const rl = RATE_LIMIT[ip as string] || { last: 0, count: 0 };
  if (now - rl.last < 1000 && rl.count > 5) return res.status(429).json({ error: 'rate-limit' });
  rl.last = now; rl.count = rl.count + 1; RATE_LIMIT[ip as string] = rl;

  try {
    const qEmb = await getEmbedding(q);
    const r = await globalThis.fetch(`${FAISS_URL.replace(/\/$/, '')}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: qEmb, k }),
    });
    const j = await r.json();
    const results: any[] = [];
    for (const r0 of j.results || []) {
      const d = await getDoc(doc(db, 'finance_docs', r0.id));
      results.push({ id: r0.id, score: r0.score, doc: d.exists() ? d.data() : null });
    }

    // log query
    await addDoc(collection(db, 'finance_queries'), { query: q, resultCount: results.length, createdAt: new Date().toISOString() });

    return res.json({ ok: true, results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
