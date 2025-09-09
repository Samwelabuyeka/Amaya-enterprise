import * as cloudManager from '../cloud/organicCloudManager';

export async function processCloudStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:cloud\]\s*/i, '').trim();
  const parts = cleaned.split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  if (cmd === 'create') {
    const name = parts[1] || `cloud-${Date.now()}`;
    const clusters = parts.slice(2);
    const r = await cloudManager.createCloud({ name, clusters });
    return { ok: true, op: 'create', cloud: r };
  }
  if (cmd === 'simulate') {
    const id = parts[1];
    const steps = parseInt(parts[2] || '1', 10);
    if (!id) throw new Error('simulate requires cloud id');
    const r = await cloudManager.simulateCloudGrowth(id, steps);
    return { ok: true, op: 'simulate', result: r };
  }
  throw new Error('unknown cloud command');
}

export default processCloudStep;
