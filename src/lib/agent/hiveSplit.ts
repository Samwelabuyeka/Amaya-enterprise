// Hive Split (prototype): split tasks into smaller shards and reassemble
export type Shard = { id: string; payload: any; done?: boolean; result?: any };

export function splitTask(taskId: string, payload: any, parts = 4): Shard[] {
  // naive splitter: for arrays split into chunks; otherwise duplicate with indices
  if (Array.isArray(payload)) {
    const chunkSize = Math.ceil(payload.length / parts);
    const shards: Shard[] = [];
    for (let i = 0; i < parts; i++) {
      shards.push({ id: `${taskId}-shard-${i}`, payload: payload.slice(i * chunkSize, (i + 1) * chunkSize) });
    }
    return shards;
  }
  // else: create parameterized shards
  return Array.from({ length: parts }).map((_, i) => ({ id: `${taskId}-shard-${i}`, payload: { ...payload, part: i } }));
}

export function reassemble(shards: Shard[]) {
  // if payloads were arrays, concat; else collect results
  if (shards.every((s) => Array.isArray(s.result))) {
    return shards.flatMap((s) => s.result as any[]);
  }
  return shards.map((s) => s.result);
}
