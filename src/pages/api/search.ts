import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getEmbedding } from '../../lib/agent/llmAdapter';

type ResultItem = {
  id: string;
  type: 'brand' | 'product';
  name: string;
  description?: string;
  score?: number;
};

function dot(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
function norm(a: number[]) {
  return Math.sqrt(dot(a, a));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string) || (req.body && req.body.q) || '';
  if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

  const openaiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!openaiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

  // get embedding for query
  const embeddingResp = await globalThis.fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: q }),
  });
  if (!embeddingResp.ok) {
    const txt = await embeddingResp.text();
    return res.status(500).json({ error: 'Embedding request failed', details: txt });
  }
  const embJson = await embeddingResp.json();
  const qEmbedding: number[] = embJson.data[0].embedding;

  // fetch brands and products
  const brandsSnap = await getDocs(collection(db, 'brands'));
  const productsSnap = await getDocs(collection(db, 'products'));

  const items: ResultItem[] = [];

  brandsSnap.forEach((d) => {
    const data: any = d.data();
    items.push({ id: d.id, type: 'brand', name: data.name || '', description: data.description || '', score: undefined });
  });
  productsSnap.forEach((d) => {
    const data: any = d.data();
    items.push({ id: d.id, type: 'product', name: data.name || '', description: data.desc || data.description || '', score: undefined });
  });

  // Compute embeddings for query and compare to stored doc embeddings when available
  const qEmbedding = await getEmbedding(q);
  function dot(a: number[], b: number[]) {
    let s = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) s += a[i] * b[i];
    return s;
  }
  function norm(a: number[]) {
    return Math.sqrt(dot(a, a));
  }

  const scored: ResultItem[] = [];
  // helper to get embedding from doc if present
  function tryGetEmbeddingFromData(data: any): number[] | null {
    if (!data) return null;
    if (data.embedding && Array.isArray(data.embedding)) return data.embedding as number[];
    return null;
  }

  for (const it of items) {
    const col = it.type === 'brand' ? brandsSnap.docs.find((d) => d.id === it.id) : productsSnap.docs.find((d) => d.id === it.id);
    const data = col ? (col.data() as any) : null;
    const emb = tryGetEmbeddingFromData(data as any);
    let score = 0;
    if (emb) {
      const similarity = dot(qEmbedding, emb) / (norm(qEmbedding) * norm(emb) + 1e-8);
      score = similarity;
    } else {
      // fallback heuristic
      const text = (it.name + ' ' + (it.description || '')).toLowerCase();
      const qlow = q.toLowerCase();
      if (text.includes(qlow)) score += 1.0;
      const words = qlow.split(/\s+/).filter(Boolean);
      for (const w of words) if (text.includes(w)) score += 0.2;
    }
    it.score = score;
    scored.push(it);
  }

  // sort by score desc
  scored.sort((a, b) => (b.score || 0) - (a.score || 0));

  return res.status(200).json({ results: scored.slice(0, 20) });
}
