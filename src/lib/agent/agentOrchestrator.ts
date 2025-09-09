import { planTask, reflect, runStep } from './cognition';
import { writeMemory } from './memory';
import { processProbabilityStep } from './processors/probabilityWaveProcessor';
import { processClusterStep } from './processors/clusterProcessor';
import { processSubstrateStep } from './processors/substrateProcessor';
import { processCloudStep } from './processors/cloudProcessor';
import { processTrilogicStep } from './processors/trilogicProcessor';
import { processChaosStep } from './processors/chaosProcessor';
import { processMayaQpuStep } from './processors/mayaQPUProcessor';
import { processMeshStep } from './processors/meshProcessor';
import { processSatelliteStep } from './processors/satelliteProcessor';
import { processMetamorphicStep } from './processors/metamorphicProcessor';
import { processFirewallStep } from './processors/firewallProcessor';
import { processZkpStep } from './processors/zkpProcessor';
import { processHomomorphicStep } from './processors/homomorphicProcessor';
import { processPolymorphStep } from './processors/polymorphProcessor';
import { processZeroTrustStep } from './processors/zeroTrustProcessor';
import { processForensicStep } from './processors/forensicProcessor';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Very small orchestrator. It persists a task queue (maya_tasks) and writes high-level events to memory.

export async function startAgent(userId: string, task: string) {
  // safety: disallow certain dangerous keywords
  const banned = ['explosive', 'illegal', 'harm', 'attack', 'malware'];
  for (const b of banned) if (task.toLowerCase().includes(b)) throw new Error('Task contains disallowed content.');

  const planText = await planTask(userId, task);
  // enqueue
  const tasksCol = collection(db, 'maya_tasks');
  const taskDoc = await addDoc(tasksCol, {
    userId,
    task,
    plan: planText,
    status: 'queued',
    createdAt: new Date().toISOString(),
  });
  await writeMemory(userId, { type: 'agent_start', task, taskId: taskDoc.id });
  return { taskId: taskDoc.id, plan: planText };
}

export async function executeStep(userId: string, step: string) {
  // execute a single step using available processors in order of preference:
  // 1) probability-wave processor (when explicitly requested or enabled)
  // 2) neuron manager (if configured)
  // 3) local LLM cognition fallback

  // allow explicit routing via a step prefix: "[processor:probability] ..."
  // allow explicit routing for substrate processor
  const useSubstrateProcessor = /^\[processor:substrate\]/i.test(step);

  // allow explicit routing for cloud processor
  const useCloudProcessor = /^\[processor:cloud\]/i.test(step);

  // allow explicit routing for trilogical/chaos/mayaqpu processors
  const useTrilogicProcessor = /^\[processor:trilogic\]/i.test(step);
  const useChaosProcessor = /^\[processor:chaos\]/i.test(step);
  const useMayaQpuProcessor = /^\[processor:mayaqpu\]/i.test(step);
  const useMeshProcessor = /^\[processor:mesh\]/i.test(step);
  const useSatelliteProcessor = /^\[processor:satellite\]/i.test(step);
  const useMetamorphicProcessor = /^\[processor:metamorphic\]/i.test(step);
  const useFirewallProcessor = /^\[processor:firewall\]/i.test(step);

  if (useTrilogicProcessor) {
    try {
      const res = await processTrilogicStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'trilogic' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useChaosProcessor) {
    try {
      const res = await processChaosStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'chaos' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useMayaQpuProcessor) {
    try {
      const res = await processMayaQpuStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'mayaqpu' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useCloudProcessor) {
    try {
      const res = await processCloudStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'cloud' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useSubstrateProcessor) {
    try {
      const res = await processSubstrateStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'substrate' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  // allow explicit routing for cluster processor
  const useClusterProcessor = /^\[processor:cluster\]/i.test(step);

  if (useClusterProcessor) {
    try {
      const res = await processClusterStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'cluster' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  const useProbabilityProcessor =
    process.env.USE_PROBABILITY_PROCESSOR === '1' || /^\[processor:probability\]/i.test(step);

  const useZkpProcessor = /^\[processor:zkp\]/i.test(step);
  const useHomomorphicProcessor = /^\[processor:homomorphic\]/i.test(step);
  const usePolymorphProcessor = /^\[processor:polymorph\]/i.test(step);
  const useZeroTrustProcessor = /^\[processor:zerotrust\]/i.test(step);
  const useForensicProcessor = /^\[processor:forensic\]/i.test(step);

  if (useZkpProcessor) {
    try {
      const res = await processZkpStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'zkp' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useHomomorphicProcessor) {
    try {
      const res = await processHomomorphicStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'homomorphic' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (usePolymorphProcessor) {
    try {
      const res = await processPolymorphStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'polymorph' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useZeroTrustProcessor) {
    try {
      const res = await processZeroTrustStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'zerotrust' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useForensicProcessor) {
    try {
      const res = await processForensicStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'forensic' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useMeshProcessor) {
    try {
      const res = await processMeshStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'mesh' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useSatelliteProcessor) {
    try {
      const res = await processSatelliteStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'satellite' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useMetamorphicProcessor) {
    try {
      const res = await processMetamorphicStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'metamorphic' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useFirewallProcessor) {
    try {
      const res = await processFirewallStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'firewall' });
      return res;
    } catch (e: any) {
      // fall through
    }
  }

  if (useProbabilityProcessor) {
    try {
      const res = await processProbabilityStep(userId, step);
      await writeMemory(userId, { type: 'agent_step', step, result: res, processor: 'probability' });
      return res;
    } catch (e: any) {
      // fall through to next processor
    }
  }

  // If a neuron manager URL is configured, route the step through it for enhanced processing
  const neuronUrl = process.env.NEURON_MANAGER_URL;
  if (neuronUrl) {
    try {
      const payload = { input_text: step, modules: [] };
      const r = await globalThis.fetch(`${neuronUrl.replace(/\/$/, '')}/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      await writeMemory(userId, { type: 'agent_step', step, result: j });
      return j;
    } catch (e: any) {
      // fallback to LLM cognition
    }
  }
  const res = await runStep(userId, step);
  await writeMemory(userId, { type: 'agent_step', step, result: res });
  return res;
}

export async function reflectAgent(userId: string) {
  return await reflect(userId);
}
