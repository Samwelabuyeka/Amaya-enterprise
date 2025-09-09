import { collection, addDoc, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { sha256Hex, merkleRootHex } from './merkle';
import crypto from 'crypto';

// NOTE: Prototype implementation. For production, use secure KMS/HSM for private keys.

export async function initLedger(name: string) {
  const meta = collection(db, 'forensic_ledgers');
  const r = await addDoc(meta, { name, createdAt: new Date().toISOString() });
  // generate a prototype keypair and store the private key encrypted in Firestore (NOT SECURE)
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const pubPem = publicKey.export({ type: 'pkcs1', format: 'pem' });
  const privPem = privateKey.export({ type: 'pkcs1', format: 'pem' });
  await setDoc(doc(db, 'forensic_ledgers', r.id), { name, publicKey: pubPem, privateKey: privPem, createdAt: new Date().toISOString() });
  return { ledgerId: r.id, name };
}

export async function appendRecord(ledgerId: string, payload: any) {
  const ledgerDoc = doc(db, 'forensic_ledgers', ledgerId);
  const ledgerSnap = await getDoc(ledgerDoc);
  if (!ledgerSnap.exists()) throw new Error('ledger not found');
  const meta: any = ledgerSnap.data();
  // compute hash
  const raw = JSON.stringify({ payload, ts: new Date().toISOString() });
  const h = sha256Hex(raw);
  // append
  await addDoc(collection(db, `forensic_ledgers/${ledgerId}/records`), { payload, h, raw, ts: new Date().toISOString() });
  // recompute merkle root over recent 128 records
  const recsSnap = await getDocs(collection(db, `forensic_ledgers/${ledgerId}/records`));
  const hashes = recsSnap.docs.slice(-128).map((d) => (d.data() as any).h);
  const root = merkleRootHex(hashes);
  // sign root with private key (prototype)
  const priv = crypto.createPrivateKey(meta.privateKey);
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(root);
  const signature = sign.sign(priv, 'hex');
  await setDoc(ledgerDoc, { lastRoot: root, lastSignature: signature }, { merge: true });
  return { h, root, signature };
}

export async function listRecords(ledgerId: string) {
  const recsSnap = await getDocs(collection(db, `forensic_ledgers/${ledgerId}/records`));
  return recsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export default { initLedger, appendRecord, listRecords };
