import { collection, addDoc, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// Cluster manager: creates scalable, persisted descriptions of large neuron clusters.
// Important: we DO NOT allocate billions of in-memory objects. Instead clusters are
// represented as summaries, sample shards and shard descriptors so they can scale to
// planet-sized counts without blowing memory.

const PI = Math.PI;
const PHI = (1 + Math.sqrt(5)) / 2;

function fib(n: number) {
  let a = 0,
    b = 1;
  for (let i = 0; i < n; i++) {
    const t = a + b;
    a = b;
    b = t;
  }
  return a;
}

export async function createCluster(opts: {
  name: string;
  targetCount?: number; // logical neuron count
  multistate?: number; // number of discrete states per neuron
  sampleSize?: number; // how many sample neurons to store
  seed?: string;
}) {
  const { name, targetCount = 1000000, multistate = 3, sampleSize = 512, seed } = opts;

  // derive some parameters using PI, PHI and Fibonacci
  const phi = PHI;
  const pi = PI;
  const fibSeed = fib(Math.max(1, Math.floor(Math.abs((seed?.length || 3) % 20))));

  // compute shard sizing: keep shardSize ~ 100k for persistence convenience
  const shardSize = 100000; // 100k neurons per shard descriptor
  const shardCount = Math.max(1, Math.ceil(targetCount / shardSize));

  // create a small sample array (randomized deterministic-ish using seed)
  const rnd = (s = 1) => {
    // simple mulberry32-like PRNG seeded by seed/fibSeed
    let t = (s + fibSeed) >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = ((r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r) >>> 0;
      return (r >>> 0) / 4294967296;
    };
  };

  const rand = rnd(seed ? seed.length : 1);
  const sample: number[] = [];
  for (let i = 0; i < Math.min(sampleSize, targetCount); i++) sample.push(rand());

  const stateCounts: Record<string, number> = {};
  for (let s = 0; s < multistate; s++) stateCounts[`s${s}`] = Math.floor((targetCount / multistate) * (1 + (s / multistate) * (phi - 1)));

  const clustersCol = collection(db, 'neuron_clusters');
  const docRef = await addDoc(clustersCol, {
    name,
    targetCount,
    multistate,
    shardSize,
    shardCount,
    sample,
    stateCounts,
    phi,
    pi,
    createdAt: new Date().toISOString(),
    seed: seed ?? null,
  });

  // create minimal shard descriptors (no heavy arrays stored)
  const shardsCol = collection(db, `neuron_clusters/${docRef.id}/shards`);
  for (let i = 0; i < shardCount; i++) {
    await addDoc(shardsCol, {
      shardIndex: i,
      logicalSize: i === shardCount - 1 ? targetCount - shardSize * (shardCount - 1) : shardSize,
      createdAt: new Date().toISOString(),
      sample: sample.slice(i % sample.length, (i % sample.length) + Math.min(16, sample.length)),
    });
  }

  return { clusterId: docRef.id, name, targetCount, shardCount };
}

export async function getCluster(clusterId: string) {
  const d = await getDoc(doc(db, 'neuron_clusters', clusterId));
  if (!d.exists()) throw new Error('Cluster not found');
  return { id: d.id, ...d.data() };
}

export async function simulateGrowth(clusterId: string, steps = 1) {
  // load cluster metadata, adjust targetCount by growth factor based on Fibonacci/phi
  const clusterRef = doc(db, 'neuron_clusters', clusterId);
  const clusterSnap = await getDoc(clusterRef);
  if (!clusterSnap.exists()) throw new Error('Cluster not found');
  const data: any = clusterSnap.data();

  const current = data.targetCount || 0;

  // growth factor: use phi^steps but modulated by a Fibonacci increment to produce bursts
  const growthFactor = Math.pow(PHI, steps) * (1 + fib(steps % 20) / 1000);
  let next = Math.max(1, Math.floor(current * growthFactor));

  // avoid runaway in-memory operations: cap the stored logical count to a huge but finite number
  const MAX_LOGICAL = 1e15; // 1 quadrillion as a safety cap for stored logical size
  if (next > MAX_LOGICAL) next = MAX_LOGICAL;

  // recompute shard count
  const shardSize = data.shardSize || 100000;
  const shardCount = Math.max(1, Math.ceil(next / shardSize));

  await updateDoc(clusterRef, { targetCount: next, shardCount, updatedAt: new Date().toISOString() });

  return { clusterId, previous: current, next, shardCount };
}

export default { createCluster, simulateGrowth, getCluster };
