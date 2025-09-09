import secrets from 'secrets.js-grempe';

export function splitSecret(secret: string, shares = 5, threshold = 3) {
  const hex = secrets.str2hex(secret);
  const parts = secrets.share(hex, shares, threshold);
  return parts; // array of hex shares
}

export function combineShares(parts: string[]) {
  const hex = secrets.combine(parts);
  return secrets.hex2str(hex);
}
