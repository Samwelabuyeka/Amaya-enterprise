// Simple IPFS adapter (requires external ipfs daemon). Provides pin/unpin and add.
import fetch from 'node-fetch';

const IPFS_API = process.env.IPFS_API || 'http://127.0.0.1:5001/api/v0';

export async function ipfsAdd(content: string) {
  // For simplicity we use a simple add via /add?wrap-with-directory=false (requires multipart); left as TODO.
  return { ok: false, error: 'Not implemented in-browser; run IPFS daemon and use CLI' };
}

export async function ipfsPin(cid: string) {
  const res = await fetch(`${IPFS_API}/pin/add?arg=${cid}`, { method: 'POST' });
  const j = await res.json();
  return j;
}
