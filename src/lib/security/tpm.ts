// TPM manager stub: provides attestation and sealed key storage interfaces.
// For production use platform TPM libraries (tss2) and hardware attestation.

const SEALED: Record<string, string> = {};

export function attest(platformInfo: any) {
  // return a fake attestation blob
  return { attestation: 'ATTEST_' + Buffer.from(JSON.stringify(platformInfo)).toString('base64') };
}

export function sealKey(id: string, keyMaterial: string) {
  SEALED[id] = keyMaterial;
  return { sealed: true };
}

export function unsealKey(id: string) {
  return SEALED[id] || null;
}

export default { attest, sealKey, unsealKey };
