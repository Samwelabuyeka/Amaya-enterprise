import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message, userId } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing message' });

  const openaiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!openaiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    // call OpenAI Chat completions (gpt-4o-mini or gpt-4o) depending on access
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
        max_tokens: 600,
      }),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(500).json({ error: 'OpenAI chat failed', details: txt });
    }
    const j = await resp.json();
    const reply = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : 'Sorry, no reply.';

    // persist message and reply to Firestore
    await addDoc(collection(db, 'maya_logs'), {
      userId: userId || null,
      message,
      reply,
      createdAt: serverTimestamp(),
    });

    return res.status(200).json({ reply });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
