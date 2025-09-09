import fetch from 'node-fetch';

// Lightweight Vault client helper. Expects VAULT_ADDR and VAULT_TOKEN in env.
// This is a minimal wrapper; for production use the official Vault SDKs and proper auth.

const VAULT_ADDR = process.env.VAULT_ADDR || process.env.NEXT_PUBLIC_VAULT_ADDR;
const VAULT_TOKEN = process.env.VAULT_TOKEN;

export async function readSecret(path: string) {
  if (!VAULT_ADDR || !VAULT_TOKEN) throw new Error('Vault not configured (VAULT_ADDR/VAULT_TOKEN)');
  const url = `${VAULT_ADDR.replace(/\/$/, '')}/v1/${path}`;
  const r = await fetch(url, { headers: { 'X-Vault-Token': VAULT_TOKEN } });
  if (!r.ok) throw new Error(`vault read failed: ${r.status} ${r.statusText}`);
  const j = await r.json();
  return j?.data ?? j; // KV v2 vs v1 differences
}

export async function writeSecret(path: string, payload: any) {
  if (!VAULT_ADDR || !VAULT_TOKEN) throw new Error('Vault not configured (VAULT_ADDR/VAULT_TOKEN)');
  const url = `${VAULT_ADDR.replace(/\/$/, '')}/v1/${path}`;
  const r = await fetch(url, { method: 'POST', headers: { 'X-Vault-Token': VAULT_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error(`vault write failed: ${r.status} ${r.statusText}`);
  return r.json();
}

export default { readSecret, writeSecret };
