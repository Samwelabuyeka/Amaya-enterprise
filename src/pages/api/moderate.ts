import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const text = req.body && req.body.text;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const openaiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!openaiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    const resp = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({ input: text }),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(500).json({ error: 'Moderation failed', details: txt });
    }
    const j = await resp.json();
    // structure: j.results[0].categories and j.results[0].flagged
    const result = j.results && j.results[0] ? j.results[0] : null;
    return res.status(200).json({ moderation: result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
