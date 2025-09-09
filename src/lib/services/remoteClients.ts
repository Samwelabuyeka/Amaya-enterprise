import fetch from 'node-fetch';

const NEURON_URL = process.env.NEURON_MANAGER_URL || 'http://localhost:8001';
const FAISS_URL = process.env.FAISS_URL || 'http://localhost:8002';

export async function inferEmbedding(model: string, input: string) {
  const res = await fetch(`${NEURON_URL}/infer`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model, input }),
  });
  return res.json();
}

export async function upsertVector(id: string, vector: number[]) {
  const res = await fetch(`${FAISS_URL}/upsert`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id, vector }),
  });
  return res.json();
}

export async function queryVector(vector: number[]) {
  const res = await fetch(`${FAISS_URL}/query`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(vector),
  });
  return res.json();
}
