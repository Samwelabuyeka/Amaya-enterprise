// Local-first LLM adapter. Configure one of these env vars:
// - LLM_LOCAL_URL (an HTTP endpoint for a locally-hosted model, e.g. text-generation-webui)
// - LLM_LOCAL_CMD (a shell command to run a local inference binary) -- NOT implemented here, left as future
// This adapter keeps the interface simple: getCompletion(prompt) => { text }

export async function getCompletion(prompt: string, opts: { maxTokens?: number } = {}) {
  const localUrl = process.env.LLM_LOCAL_URL;
  if (!localUrl) {
    throw new Error('No local LLM configured. Set LLM_LOCAL_URL to your local model server.');
  }

  // Example POST shape for text-generation-webui or similar local servers. Adjust if needed.
  const body = {
    inputs: prompt,
    parameters: {
      max_new_tokens: opts.maxTokens || 512,
      do_sample: false,
    },
  } as any;

  const res = await globalThis.fetch(localUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`LLM request failed: ${res.status} ${txt}`);
  }
  const json = await res.json();

  // normalize common responses
  if (json && typeof json === 'object') {
    if (json.generated_text) return { text: json.generated_text };
    if (Array.isArray(json) && json[0] && json[0].generated_text) return { text: json[0].generated_text };
    if (json.choices && json.choices[0] && json.choices[0].text) return { text: json.choices[0].text };
  }
  return { text: JSON.stringify(json) };
}

export async function healthCheck() {
  const localUrl = process.env.LLM_LOCAL_URL;
  if (!localUrl) return { ok: false, error: 'LLM_LOCAL_URL not set' };
  try {
    const body = { inputs: 'hello', parameters: { max_new_tokens: 5 } };
    const res = await globalThis.fetch(localUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { ok: false, status: res.status, text: await res.text() };
    const json = await res.json();
    return { ok: true, sample: json };
  } catch (err: any) {
    return { ok: false, error: err.message || String(err) };
  }
}

export async function getEmbedding(text: string) {
  // Prefer a dedicated local embedding endpoint if provided
  const embUrl = process.env.LLM_LOCAL_EMBEDDING_URL || process.env.LLM_LOCAL_URL;
  if (!embUrl) {
    // fallback: simple hashed pseudo-embedding (deterministic, low-quality)
    // NOTE: replace with a proper embedding server for production
    const hash = Array.from(text).reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 1000003, 7);
    const vec = new Array(1536).fill(0).map((_, i) => Math.sin(hash + i));
    return vec;
  }

  try {
    const body = { inputs: text, parameters: { max_new_tokens: 0 } };
    const res = await globalThis.fetch(embUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    // normalize common shapes
    if (json && json.data && Array.isArray(json.data) && json.data[0].embedding) return json.data[0].embedding;
    if (json && json.embedding) return json.embedding;
    if (Array.isArray(json) && json[0] && json[0].embedding) return json[0].embedding;
    // fallback to pseudo-embedding
    return new Array(1536).fill(0).map((_, i) => Math.cos(i + text.length));
  } catch (err) {
    return new Array(1536).fill(0).map((_, i) => Math.cos(i + text.length));
  }
}
