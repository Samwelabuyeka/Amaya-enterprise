// Very small HTN planner scaffold. Define tasks and methods and run a depth-first decomposition.

type Task = { name: string; args?: any };
type Method = { task: string; decompose: (t: Task) => Task[] };

const METHODS: Method[] = [];

export function registerMethod(m: Method) {
  METHODS.push(m);
}

export function plan(task: Task): Task[] {
  // naive DFS decomposition
  const plan: Task[] = [];
  function decompose(t: Task) {
    const m = METHODS.find((mm) => mm.task === t.name);
    if (!m) {
      plan.push(t);
      return;
    }
    const subtasks = m.decompose(t);
    for (const s of subtasks) decompose(s);
  }
  decompose(task);
  return plan;
}
