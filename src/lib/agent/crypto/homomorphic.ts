// WARNING: Mock homomorphic functions — replace with real HE libraries (e.g., PALISADE, SEAL) for production.

const MOD = 2147483647;

export function encryptNumber(n: number, key = 123456) {
  return (Math.floor(n * 1e6) + key) % MOD;
}

export function addEncrypted(a: number, b: number) {
  return (a + b) % MOD;
}

export function decryptNumber(c: number, key = 123456) {
  return (c - key + MOD) % MOD / 1e6;
}

export default { encryptNumber, addEncrypted, decryptNumber };
