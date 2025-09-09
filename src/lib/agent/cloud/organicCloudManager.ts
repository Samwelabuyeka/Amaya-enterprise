import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { compressEmbedding } from '../../ai/fractalCompression';

// Organic Cloud Manager: composes many clusters into a logical "organic cloud".
// Uses summary descriptors, fractal compression for dense representation, and
// strictly bounded logical counts so we never allocate real billions of objects.

export async function createCloud(opts: { name: string; clusters: string[]; replication?: number }) {
  const { name, clusters = [], replication = 3 } = opts;
  const clouds = collection(db, 'organic_clouds');
  const docRef = await addDoc(clouds, {
    name,
    clusters,
    replication,
    createdAt: new Date().toISOString(),
  });

  // compute a tiny density descriptor by sampling cluster meta (if available)
  const samples: any[] = [];
  for (const cid of clusters.slice(0, 8)) {
    try {
      const meta = await getDoc(doc(db, 'neuron_clusters', cid));
      if (meta.exists()) {
        const data: any = meta.data();
        // compress a small signature of the sample array if present
        const sig = Array.isArray(data.sample) && data.sample.length ? compressEmbedding(data.sample.slice(0, 64).map((v: any) => Number(v) || 0), 0.2) : null;
        samples.push({ clusterId: cid, shardCount: data.shardCount || 0, sig });
      }
    } catch (e) {
      // ignore
    }
  }

  await updateDoc(doc(db, 'organic_clouds', docRef.id), { samples });
  return { cloudId: docRef.id, name, clusters, replication };
}

export async function simulateCloudGrowth(cloudId: string, steps = 1) {
  const ref = doc(db, 'organic_clouds', cloudId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('cloud not found');
  const data: any = snap.data();
  const clusters: string[] = data.clusters || [];

  // record per-cluster simulated adjustments (bounded)
  const results: any[] = [];
  for (const cid of clusters) {
    try {
      // lightweight growth: increase logical size by phi^steps scaled by replication
      const clusterSnap = await getDoc(doc(db, 'neuron_clusters', cid));
      if (!clusterSnap.exists()) continue;
      const cd: any = clusterSnap.data();
      const prev = cd.targetCount || 0;
      const phi = (1 + Math.sqrt(5)) / 2;
      const next = Math.min(1e15, Math.floor(prev * Math.pow(phi, steps) * (data.replication || 1)));
      await updateDoc(doc(db, 'neuron_clusters', cid), { targetCount: next, updatedAt: new Date().toISOString() });
      results.push({ clusterId: cid, previous: prev, next });
    } catch (e: any) {
      results.push({ clusterId: cid, error: String(e.message || e) });
    }
  }

  await updateDoc(ref, { lastSimulatedAt: new Date().toISOString(), lastResults: results });
  return { cloudId, results };
}

export default { createCloud, simulateCloudGrowth };
