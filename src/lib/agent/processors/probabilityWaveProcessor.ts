import { getEmbedding, getCompletion } from '../llmAdapter';
import { cosineSimilarity } from '../../utils/cosine';

// A lightweight probability-wave inspired processor.
// Not quantum: models computation as superposed candidate continuations with weights
// represented as probability amplitudes. It generates N candidates (via LLM sampling),
// scores them with a fast semantic similarity to the input, converts scores to a softmax
// distribution, and returns a merged result that preserves the highest-probability paths.

type Candidate = { text: string; embedding?: number[]; score?: number };

function softmax(arr: number[], temp = 1.0) {
  const exps = arr.map((v) => Math.exp(v / temp));
  const s = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((e) => e / s);
}

async function embedIfMissing(c: Candidate) {
  if (!c.embedding) c.embedding = await getEmbedding(c.text);
  return c;
}

export async function processProbabilityStep(userId: string, step: string, opts?: { candidates?: number; temperature?: number }) {
  const candidatesN = opts?.candidates ?? 5;
  const temperature = opts?.temperature ?? 0.7;

  // remove an optional prefix marker
  const cleaned = step.replace(/^\[processor:probability\]\s*/i, '');

  // 1) generate N candidate continuations using the LLM with sampling
  const prompts = [] as string[];
  for (let i = 0; i < candidatesN; i++) prompts.push(cleaned + '\n\n### Candidate continuation ' + (i + 1));

  const responses = await Promise.all(
    prompts.map((p) => getCompletion(p, { max_tokens: 200, temperature }))
  );

  const candidates: Candidate[] = responses.map((r) => ({ text: r.text ?? r, score: 0 }));

  // 2) compute embeddings for input and candidates
  const inputEmb = await getEmbedding(cleaned);
  await Promise.all(candidates.map((c) => embedIfMissing(c)));

  // 3) score candidates by cosine similarity to input
  for (const c of candidates) {
    c.score = cosineSimilarity(inputEmb, c.embedding || []) || 0;
  }

  // 4) turn scores into a probability distribution (softmax over scores)
  const scores = candidates.map((c) => c.score ?? 0);
  const probs = softmax(scores, temperature);

  // 5) produce a merged answer by weighting candidate sentences
  // simple strategy: pick top-K by probability and return them with their weights
  const ranked = candidates
    .map((c, i) => ({ ...c, prob: probs[i] }))
    .sort((a, b) => b.prob - a.prob);

  // return structured result with summary and chosen continuation
  const top = ranked[0];
  const summary = `Merged result (top candidate prob=${(top.prob * 100).toFixed(1)}%): ${top.text}`;

  return { summary, candidates: ranked.slice(0, Math.min(5, ranked.length)) };
}

export default processProbabilityStep;
