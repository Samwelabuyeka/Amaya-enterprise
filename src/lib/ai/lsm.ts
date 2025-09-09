// Liquid State Machine (reservoir computing) placeholder implementation.
export function makeReservoir(size=100) {
  return { size, state: new Array(size).fill(0) };
}

export function stepReservoir(res: any, inputVec: number[]) {
  // random update
  for (let i = 0; i < res.size; i++) res.state[i] = Math.tanh((res.state[i] || 0) * 0.9 + (inputVec[i % inputVec.length] || 0));
  return res.state.slice(0, 10);
}
