import * as poly from '../polymorph/polymorph';

export async function processPolymorphStep(userId: string, step: string) {
  const cleaned = step.replace(/^\[processor:polymorph\]\s*/i, '').trim();
  // format: transform {"prefix":"p_"} <payload-as-json string>
  const m = /transform\s+([^\s]+)\s+(.+)/i.exec(cleaned);
  if (!m) throw new Error('invalid polymorph command');
  const opts = JSON.parse(m[1]);
  const src = JSON.parse(m[2]);
  const transformed = poly.transformSource(src.code || src, opts);
  return { transformed };
}

export default processPolymorphStep;
