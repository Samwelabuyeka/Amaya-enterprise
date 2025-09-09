// Thinking Threads (prototype): manage multiple parallel reasoning threads
export type Thread<T = any> = {
  id: string;
  state: 'pending' | 'running' | 'done' | 'failed';
  result?: T;
  startedAt?: string;
  finishedAt?: string;
};

const threads: Map<string, Thread> = new Map();

export function spawnThread<T = any>(id: string) {
  const t: Thread<T> = { id, state: 'pending' };
  threads.set(id, t);
  return t;
}

export function startThread(id: string) {
  const t = threads.get(id);
  if (!t) return null;
  t.state = 'running';
  t.startedAt = new Date().toISOString();
  return t;
}

export function finishThread<T = any>(id: string, result: T) {
  const t = threads.get(id);
  if (!t) return null;
  t.state = 'done';
  t.result = result;
  t.finishedAt = new Date().toISOString();
  return t;
}

export function listThreads() { return Array.from(threads.values()); }

export function mergeResults<T = any>(ids: string[]) {
  // naive merge: collect all results into an array
  return ids.map((id) => threads.get(id)?.result);
}
