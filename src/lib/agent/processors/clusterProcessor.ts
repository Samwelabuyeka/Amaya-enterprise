import * as clusterManager from '../clusters/clusterManager';

// Simple cluster processor that understands commands like:
// "[processor:cluster simulate <clusterId> <steps>]" or
// "[processor:cluster info <clusterId>]"

export async function processClusterStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:cluster\]\s*/i, '').trim();
  const parts = cleaned.split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  if (cmd === 'simulate') {
    const clusterId = parts[1];
    const steps = parseInt(parts[2] || '1', 10);
    if (!clusterId) throw new Error('simulate requires clusterId');
    const r = await clusterManager.simulateGrowth(clusterId, steps);
    return { ok: true, op: 'simulate', result: r };
  }
  if (cmd === 'info') {
    const clusterId = parts[1];
    if (!clusterId) throw new Error('info requires clusterId');
    const r = await clusterManager.getCluster(clusterId);
    return { ok: true, op: 'info', cluster: r };
  }
  if (cmd === 'create') {
    // create <name> <targetCount>
    const name = parts[1] || `cluster-${Date.now()}`;
    const target = parseInt(parts[2] || '1000000', 10);
    const r = await clusterManager.createCluster({ name, targetCount: target });
    return { ok: true, op: 'create', cluster: r };
  }
  throw new Error('Unknown cluster command');
}

export default processClusterStep;
