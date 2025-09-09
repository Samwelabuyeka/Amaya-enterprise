import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { issueToken } from '../agent/security/zeroTrust';
import { writeSecret } from '../vault/vaultClient';

// Aya manager: orchestrates invites and market discovery.

export async function inviteBrand(email: string, brandName: string) {
  // create invite record and issue provisional token
  const invites = collection(db, 'aya_invites');
  const r = await addDoc(invites, { email, brandName, createdAt: new Date().toISOString(), status: 'pending' });
  const token = issueToken(`invite-${r.id}`, 60 * 60 * 24);
  // store invite token in Vault for later verification (prototype)
  try {
    await writeSecret(`secret/aya/invites/${r.id}`, { token, email, brandName });
  } catch (e) {
    // vault optional
  }
  return { inviteId: r.id, token };
}

export async function discoverMarkets(seedKeywords: string[]) {
  // placeholder: return synthetic market suggestions using keywords
  const markets = seedKeywords.slice(0, 8).map((k, i) => ({ id: `m-${i}`, name: `${k}-market`, score: Math.random() }));
  return markets.sort((a, b) => b.score - a.score);
}

export default { inviteBrand, discoverMarkets };
