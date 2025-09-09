Agent research scaffolds (prototype)

Files added:
- `src/lib/agent/rlhf.ts` — RLHF trajectory store and batch preparation (prototype).
- `src/lib/agent/goalTree.ts` — goal tree creation and evaluation helpers.
- `src/lib/agent/scientificSolver.ts` — experiment manager with epsilon-greedy proposal.
- `src/lib/agent/codeAutonomy.ts` — static analysis and test generation helpers (no execution).
- `src/lib/agent/perception.ts` — lightweight perception stubs for text/image/audio.
- `src/lib/agent/neuralCities.ts` — simulated growing cities graph for research experiments.

Important safety notes:
- These modules are explicit research scaffolds and are intentionally non-executing for untrusted code.
- Never wire `codeAutonomy.prepareRunCommand` into an automatic execution pipeline without human review or hardened sandboxing.
- Replace heuristic reward functions with human-labeled datasets for production RLHF.

Suggested next steps:
- Integrate an offline trainer that consumes `rlhf.prepareBatch()` outputs and trains a reward model in a secure environment.
- Add unit tests for `neuralCities.stepSimulation()` and `scientificSolver.proposeNext()`.

Recently added modules:
- `src/lib/agent/mythios.ts` — symbolic/meta layer for facts and provenance.
- `src/lib/agent/hiveSplit.ts` — task sharding and reassembly helpers.
- `src/lib/agent/realityAnchors.ts` — grounding and evidence anchors for facts/observations.
- `src/lib/agent/thinkingThreads.ts` — controlled parallel thinking thread manager.

Safety and design notes:
- These modules are designed to be deterministic, auditable, and non-self-modifying. They intentionally avoid arbitrary code execution. Use them as high-level planners and keep execution gated behind human review or hardened sandboxes.

