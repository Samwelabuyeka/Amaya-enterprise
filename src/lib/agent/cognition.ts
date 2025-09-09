import { getCompletion } from './llmAdapter';
import { writeMemory, readRecentMemory } from './memory';

// A very small "cognition" layer that provides:
// - planning: break tasks into steps
// - reflection: summarize recent memory
// - execution: call LLM for step results and write memory

export async function planTask(userId: string, task: string) {
  const prompt = `You are Maya's cognition module. Break the following task into a numbered list of short actionable steps. Task: ${task}`;
  const { text } = await getCompletion(prompt, { maxTokens: 200 });
  await writeMemory(userId, { type: 'plan', task, plan: text });
  return text;
}

export async function reflect(userId: string) {
  const mem = await readRecentMemory(userId, 10);
  const prompt = `You are Maya's reflection module. Given the recent memory entries: ${JSON.stringify(
    mem,
  )}, produce a 2-3 sentence summary of the agent's recent actions, what worked, and what to try next.`;
  const { text } = await getCompletion(prompt, { maxTokens: 200 });
  await writeMemory(userId, { type: 'reflection', reflection: text });
  return text;
}

export async function runStep(userId: string, step: string) {
  const prompt = `You are Maya executing an atomic step: ${step}. Provide a concise result and next-action suggestion.`;
  const { text } = await getCompletion(prompt, { maxTokens: 400 });
  await writeMemory(userId, { type: 'step_result', step, result: text });
  return text;
}
