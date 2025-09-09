import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { deviceId, owner, metadata } = req.body || {};
  if (!deviceId || !owner) return res.status(400).json({ error: 'deviceId and owner required' });
  const col = collection(db, 'iot_devices');
  const doc = await addDoc(col, { deviceId, owner, metadata: metadata || {}, createdAt: new Date().toISOString() });
  return res.json({ ok: true, id: doc.id });
}
