import type { NextApiRequest, NextApiResponse } from 'next';
import { getEmbedding } from '../../../lib/agent/llmAdapter';
import { db } from '../../../lib/firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

const FAISS_URL = process.env.FAISS_URL || 'http://localhost:8002';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const apiKey = req.headers['x-admin-api-key'];
  if (!apiKey || apiKey !== process.env.AGENT_ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  const { docs } = req.body || {};
  if (!Array.isArray(docs) || docs.length === 0) return res.status(400).json({ error: 'Provide docs array' });

  try {
    const embeddings: number[][] = [];
    const ids: string[] = [];
    for (const d of docs) {
      const id = `finance:${d.id || Math.random().toString(36).slice(2, 10)}`;
      const text = (d.text || d.content || d.body || '').toString();
      const emb = await getEmbedding(text);
      embeddings.push(emb);
      ids.push(id);
      // store metadata
      await setDoc(doc(db, 'finance_docs', id), { id, text, meta: d.meta || {}, createdAt: new Date().toISOString() });
    }

    // call FAISS index
    const r = await globalThis.fetch(`${FAISS_URL.replace(/\/$/, '')}/index`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeddings, ids }),
    });
    const j = await r.json();
    return res.json({ ok: true, indexed: ids.length, faiss: j });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
