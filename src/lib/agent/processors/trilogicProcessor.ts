// Trilogical processor: implements a bounded three-valued logic evaluator (Kleene-like)
// Values: 1 = true, 0 = false, 2 = unknown/indeterminate

type TVal = 0 | 1 | 2;

function parseVal(s: string): TVal {
  const t = s.trim().toLowerCase();
  if (t === '1' || t === 'true' || t === 't') return 1;
  if (t === '0' || t === 'false' || t === 'f') return 0;
  return 2;
}

function not(v: TVal): TVal {
  if (v === 1) return 0;
  if (v === 0) return 1;
  return 2;
}

function and(a: TVal, b: TVal): TVal {
  if (a === 0 || b === 0) return 0;
  if (a === 2 || b === 2) return 2;
  return 1;
}

function or(a: TVal, b: TVal): TVal {
  if (a === 1 || b === 1) return 1;
  if (a === 2 || b === 2) return 2;
  return 0;
}

// Very small expression evaluator supporting variables, NOT, AND, OR, parentheses.
// This is intentionally minimal: tokens split by whitespace or parens.
function evalTokens(tokens: string[], env: Record<string, TVal>): TVal {
  // Shunting-yard style: but for brevity implement a simple recursive parser
  let i = 0;
  function parseExpr(): TVal {
    let left = parseTerm();
    while (i < tokens.length) {
      const op = tokens[i].toLowerCase();
      if (op === 'or') {
        i++;
        const right = parseTerm();
        left = or(left, right);
        continue;
      }
      break;
    }
    return left;
  }
  function parseTerm(): TVal {
    let left = parseFactor();
    while (i < tokens.length) {
      const op = tokens[i].toLowerCase();
      if (op === 'and') {
        i++;
        const right = parseFactor();
        left = and(left, right);
        continue;
      }
      break;
    }
    return left;
  }
  function parseFactor(): TVal {
    if (i >= tokens.length) return 2;
    let t = tokens[i++];
    if (t === '(') {
      const v = parseExpr();
      if (tokens[i] === ')') i++;
      return v;
    }
    if (t.toLowerCase() === 'not') {
      const v = parseFactor();
      return not(v);
    }
    // variable or literal
    if (t.includes('=')) {
      const [k, val] = t.split('=');
      const v = parseVal(val);
      env[k] = v;
      return v;
    }
    // look up in env
    const key = t.trim();
    if (env.hasOwnProperty(key)) return env[key];
    return parseVal(t);
  }

  return parseExpr();
}

export async function processTrilogicStep(userId: string, step: string) {
  // cleaned format: [processor:trilogic] EVAL <expression> | ASSIGNMENTS
  const cleaned = step.replace(/^\[processor:trilogic\]\s*/i, '').trim();
  // support syntax: eval a and (not b) a=1 b=2
  const parts = cleaned.split('|').map((s) => s.trim()).filter(Boolean);
  const expr = parts[0] || '';
  const assigns = parts[1] || '';
  const env: Record<string, TVal> = {};
  // parse assignments
  for (const a of assigns.split(/\s+/).filter(Boolean)) {
    if (a.includes('=')) {
      const [k, v] = a.split('=');
      env[k.trim()] = parseVal(v.trim());
    }
  }
  const tokens = expr.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').split(/\s+/).filter(Boolean);
  const result = evalTokens(tokens, env);
  const map = { '0': 'false', '1': 'true', '2': 'unknown' } as any;
  return { expression: expr, env, result: map[String(result)] };
}

export default processTrilogicStep;
