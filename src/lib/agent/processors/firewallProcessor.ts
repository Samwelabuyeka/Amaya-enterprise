import * as fw from '../security/fractalFirewall';

export async function processFirewallStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:firewall\]\s*/i, '').trim();
  // format: [processor:firewall] name attrs=ip:1.2.3.4,port:80 rules=...
  const name = (/name=([^|\s]+)/i.exec(cleaned) || [])[1] || `fw-${Date.now()}`;
  const attrsPart = (/attrs=([^|]+)/i.exec(cleaned) || [])[1] || '';
  const attrs: any = {};
  for (const kv of attrsPart.split(/[,;]+/).map((s) => s.trim()).filter(Boolean)) {
    const [k, v] = kv.split(':');
    attrs[k] = v;
  }
  const r = await fw.simulateFirewall(name, attrs);
  return r;
}

export default processFirewallStep;
