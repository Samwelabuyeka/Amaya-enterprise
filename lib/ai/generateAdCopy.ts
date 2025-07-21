export function generateAdCopy(input: {
  name: string;
  category: string;
  region: string;
  special?: string;
}): string {
  const { name, category, region, special } = input;

  let copy = `${name} — a standout in ${category} from ${region}`;
  if (special) {
    copy += `. Known for ${special.toLowerCase()}`;
  }

  copy += `. Discover more on Amaya.`;
  return copy;
}
