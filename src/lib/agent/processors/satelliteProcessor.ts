import * as sat from '../network/satelliteManager';

export async function processSatelliteStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:satellite\]\s*/i, '').trim();
  if (cleaned.startsWith('create')) {
    const parts = cleaned.split(/\s+/);
    const name = parts[1] || `const-${Date.now()}`;
    const sats = Number((/sats=(\d+)/i.exec(cleaned) || [])[1]) || 24;
    return await sat.createConstellation({ name, sats });
  }
  if (cleaned.startsWith('link')) {
    const parts = cleaned.split(/\s+/);
    const constId = parts[1];
    const from = parts[2];
    const to = parts[3];
    return await sat.simulateLink(constId, from, to);
  }
  throw new Error('unknown satellite command');
}

export default processSatelliteStep;
