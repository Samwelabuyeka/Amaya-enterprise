import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { executeStep } from '../../../src/lib/agent/agentOrchestrator';
import { getCompletion, healthCheck } from '../../../src/lib/agent/llmAdapter';

// This endpoint processes one queued task. It is intended for manual/testing runs.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // quick auth via header (in prod use proper auth)
  const apiKey = req.headers['x-admin-api-key'];
  if (!apiKey || apiKey !== process.env.AGENT_ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  // ensure LLM is healthy
  const hc = await healthCheck();
  if (!hc.ok) return res.status(500).json({ error: 'LLM health check failed', details: hc });

  const tasksCol = collection(db, 'maya_tasks');
  const q = query(tasksCol, where('status', '==', 'queued'), orderBy('createdAt', 'asc'), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return res.json({ ok: true, message: 'no queued tasks' });
  const taskDoc = snap.docs[0];
  const task = taskDoc.data();

  // mark as running
  await updateDoc(doc(db, 'maya_tasks', taskDoc.id), { status: 'running', startedAt: new Date().toISOString() } as any);

  try {
    // plan is expected to be a numbered list; split into lines
    const planText = task.plan || '';
    const lines = planText.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
    for (const line of lines) {
      // skip numbering like "1. "
      const step = line.replace(/^\d+\.\s*/, '');
      await executeStep(task.userId, step);
    }
    await updateDoc(doc(db, 'maya_tasks', taskDoc.id), { status: 'done', finishedAt: new Date().toISOString() } as any);
    return res.json({ ok: true, taskId: taskDoc.id, status: 'done' });
  } catch (err: any) {
    await updateDoc(doc(db, 'maya_tasks', taskDoc.id), { status: 'error', error: err.message || String(err) } as any);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
