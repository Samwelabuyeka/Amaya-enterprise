import * as mesh from '../network/meshManager';

export async function processMeshStep(userId: string, step: string) {
  // [processor:mesh] create name nodes=10 | addnode meshId nodeId location=xyz
  const cleaned = step.replace(/^\[processor:mesh\]\s*/i, '').trim();
  if (cleaned.startsWith('create')) {
    const parts = cleaned.split(/\s+/);
    const name = parts[1] || `mesh-${Date.now()}`;
    const expected = Number((/nodes=(\d+)/i.exec(cleaned) || [])[1]) || 50;
    return await mesh.createMesh({ name, expectedNodes: expected });
  }
  if (cleaned.startsWith('addnode')) {
    const parts = cleaned.split(/\s+/);
    const meshId = parts[1];
    const nodeId = parts[2] || undefined;
    return await mesh.addNode(meshId, { id: nodeId });
  }
  if (cleaned.startsWith('route')) {
    const parts = cleaned.split(/\s+/);
    return await mesh.simulateRouting(parts[1], parts[2], parts[3], Number(parts[4] || 3));
  }
  throw new Error('unknown mesh command');
}

export default processMeshStep;
