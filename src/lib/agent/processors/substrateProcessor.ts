import * as substrateManager from '../substrate/substrateManager';

export async function processSubstrateStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:substrate\]\s*/i, '').trim();
  const parts = cleaned.split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  if (cmd === 'create') {
    const name = parts[1] || `substrate-${Date.now()}`;
    const states = parseInt(parts[2] || '3', 10);
    const r = await substrateManager.createSubstrate({ name, states });
    return { ok: true, op: 'create', substrate: r };
  }
  if (cmd === 'run') {
    const id = parts[1];
    const steps = parseInt(parts[2] || '1', 10);
    if (!id) throw new Error('run requires substrate id');
    const r = await substrateManager.runSubstrate(id, parts.slice(3).join(' ') || 'start', steps);
    return { ok: true, op: 'run', result: r };
  }
  throw new Error('unknown substrate command');
}

export default processSubstrateStep;
