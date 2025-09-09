import { collection, addDoc, doc, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

// Mesh manager: models a logical mesh of nodes with lightweight routing descriptors.
// This is a simulator only: no network sockets, purely metadata persisted to Firestore.

export async function createMesh(opts: { name: string; expectedNodes?: number; redundancy?: number }) {
  const { name, expectedNodes = 50, redundancy = 2 } = opts;
  const meshes = collection(db, 'meshes');
  const docRef = await addDoc(meshes, { name, expectedNodes, redundancy, createdAt: new Date().toISOString() });
  return { meshId: docRef.id, name, expectedNodes, redundancy };
}

export async function addNode(meshId: string, node: { id?: string; location?: string; capabilities?: string[] }) {
  const nodes = collection(db, `meshes/${meshId}/nodes`);
  const r = await addDoc(nodes, { ...node, createdAt: new Date().toISOString() });
  return { nodeId: r.id, ...node };
}

export async function listNodes(meshId: string) {
  const snap = await getDocs(collection(db, `meshes/${meshId}/nodes`));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function simulateRouting(meshId: string, fromNodeId: string, toNodeId: string, hops = 3) {
  // load mesh metadata and produce a bounded routing path using node samples
  const nodes = await listNodes(meshId);
  if (!nodes.length) throw new Error('no nodes in mesh');
  const start = nodes.find((n: any) => n.id === fromNodeId) || nodes[Math.floor(Math.random() * nodes.length)];
  const end = nodes.find((n: any) => n.id === toNodeId) || nodes[Math.floor(Math.random() * nodes.length)];
  const path: any[] = [start.id || 'start'];
  for (let i = 0; i < Math.min(hops, 16); i++) {
    const pick = nodes[Math.floor(Math.random() * nodes.length)];
    path.push(pick.id);
    if (pick.id === end.id) break;
  }
  if (path[path.length - 1] !== end.id) path.push(end.id);
  // persist a small trace
  await addDoc(collection(db, `meshes/${meshId}/traces`), { from: fromNodeId, to: toNodeId, path, ts: new Date().toISOString() });
  return { meshId, path };
}

export default { createMesh, addNode, listNodes, simulateRouting };
