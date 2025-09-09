import fs from 'fs';
const ALLOWLIST = (process.env.EGRESS_ALLOWLIST || 'api.trusted.com,localhost').split(',').map(s=>s.trim()).filter(Boolean);

export function validateEgress(url: string) {
  try {
    const u = new URL(url);
    const host = u.host;
    const ok = ALLOWLIST.some(a => host.endsWith(a));
    // log
    fs.appendFileSync('egress.log', `${new Date().toISOString()} ${url} allowed=${ok}\n`);
    return { ok, host };
  } catch (e) {
    return { ok: false, error: 'invalid url' };
  }
}
