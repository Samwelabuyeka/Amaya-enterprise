import { chooseStrategy, morphParameters } from '../algorithms/metamorphic';

export async function processMetamorphicStep(userId: string, step: string) {
  // format: [processor:metamorphic] metrics=latency:200,error:0.05,load:0.7
  const cleaned = step.replace(/^\[processor:metamorphic\]\s*/i, '').trim();
  const metricsPart = (/metrics=(.+)/i.exec(cleaned) || [])[1] || '';
  const metrics: any = {};
  for (const kv of metricsPart.split(/[,;]+/).map((s) => s.trim()).filter(Boolean)) {
    const [k, v] = kv.split(':');
    metrics[k] = Number(v);
  }
  const strat = chooseStrategy(metrics);
  const params = morphParameters(strat, metrics);
  return { strategy: strat, params };
}

export default processMetamorphicStep;
