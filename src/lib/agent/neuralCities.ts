// Neural Cities (prototype) — simulated graph of neuron-populated cities
export type City = { id: string; population: number; resources: number; growthRate: number };

const cities: City[] = [];

export function createCity(id: string, population = 1000, resources = 1000) {
  const c: City = { id, population, resources, growthRate: 1.01 };
  cities.push(c);
  return c;
}

export function stepSimulation() {
  for (const c of cities) {
    const delta = Math.floor((c.population * (c.growthRate - 1)) + (Math.log(c.resources + 1) * 0.1));
    c.population += Math.max(0, delta);
    c.resources = Math.max(0, c.resources - Math.floor(c.population * 0.001));
    // small chance of new city spawn
    if (Math.random() < 0.01 && c.population > 5000) {
      createCity(`${c.id}-spawn-${Date.now()}`, Math.floor(c.population * 0.1), Math.floor(c.resources * 0.2));
    }
  }
  return cities;
}

export function summary() {
  return cities.map((c) => ({ id: c.id, population: c.population, resources: c.resources }));
}
