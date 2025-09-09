import * as ledger from '../forensics/forensicLedger';

export async function processForensicStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:forensic\]\s*/i, '').trim();
  if (cleaned.startsWith('init')) {
    const name = cleaned.replace(/^init\s*/i, '') || `ledger-${Date.now()}`;
    return await ledger.initLedger(name);
  }
  if (cleaned.startsWith('append')) {
    const m = cleaned.match(/^append\s+(\S+)\s+(.+)/i);
    if (!m) throw new Error('append requires ledgerId and json payload');
    const ledgerId = m[1];
    const payload = JSON.parse(m[2]);
    return await ledger.appendRecord(ledgerId, payload);
  }
  if (cleaned.startsWith('list')) {
    const ledgerId = cleaned.replace(/^list\s*/i, '').trim();
    return await ledger.listRecords(ledgerId);
  }
  throw new Error('unknown forensic command');
}

export default processForensicStep;
