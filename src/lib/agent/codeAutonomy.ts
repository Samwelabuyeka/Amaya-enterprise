// Code Autonomy (safe scaffold)
// This module provides static analysis hooks, unit-test generation helpers,
// and a sandbox interface that explicitly does NOT execute arbitrary code.

export type CodeUnit = { id: string; language: string; source: string };

export function staticAnalyze(unit: CodeUnit) {
  // Very small static checks: look for forbidden patterns
  const forbidden = [/exec\(/, /child_process/, /\.spawn\(/, /rm -rf/];
  const matches = forbidden.filter((rx) => rx.test(unit.source));
  return { id: unit.id, issues: matches.map((m) => m.toString()) };
}

export function generateTestStub(unit: CodeUnit) {
  // Produce a minimal unit test skeleton for the given language
  if (unit.language === 'ts' || unit.language === 'js') {
    return `describe('${unit.id}', () => { it('placeholder', () => { /* add assertions */ }) })`;
  }
  return `# test stub for ${unit.id}`;
}

// NEVER execute arbitrary source. Provide a function that returns a command
// the operator can run manually in a controlled environment.
export function prepareRunCommand(unit: CodeUnit, runtime = 'node') {
  return `# Manual run command (run locally with care): ${runtime} path/to/${unit.id}`;
}

export default { staticAnalyze, generateTestStub, prepareRunCommand };
