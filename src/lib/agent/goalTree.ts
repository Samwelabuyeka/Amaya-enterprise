export type GoalNode = {
  id: string;
  title: string;
  description?: string;
  children?: GoalNode[];
  priority?: number;
  satisfied?: boolean;
};

export function createGoal(id: string, title: string, description?: string): GoalNode {
  return { id, title, description, children: [], priority: 1, satisfied: false };
}

export function addSubgoal(parent: GoalNode, child: GoalNode) {
  parent.children = parent.children || [];
  parent.children.push(child);
}

export function evaluateGoals(root: GoalNode): GoalNode[] {
  // Return ordered list of unsatisfied goals by priority
  const list: GoalNode[] = [];
  function walk(n: GoalNode) {
    if (!n.satisfied) list.push(n);
    (n.children || []).forEach(walk);
  }
  walk(root);
  return list.sort((a, b) => (b.priority || 1) - (a.priority || 1));
}
