export function suggestTags(input: {
  name: string;
  description: string;
  category: string;
  region: string;
}): string[] {
  const baseTags = [];

  if (input.category) baseTags.push(`#${input.category.toLowerCase()}`);
  if (input.region) baseTags.push(`#${input.region.toLowerCase()}`);
  if (input.name) baseTags.push(`#${input.name.split(" ")[0].toLowerCase()}`);
  
  if (input.description.includes("organic")) baseTags.push("#organic");
  if (input.description.includes("handmade")) baseTags.push("#handmade");
  if (input.description.includes("local")) baseTags.push("#shoplocal");
  if (input.description.includes("eco")) baseTags.push("#eco");

  return [...new Set(baseTags)];
}
