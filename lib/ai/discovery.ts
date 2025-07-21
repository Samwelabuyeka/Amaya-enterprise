type Brand = {
  name: string;
  category: string;
  region: string;
  keywords: string[];
};

export function matchBrandToSearch(
  brand: Brand,
  searchQuery: string,
  userRegion: string
): number {
  const query = searchQuery.toLowerCase();
  const nameScore = brand.name.toLowerCase().includes(query) ? 2 : 0;
  const categoryScore = brand.category.toLowerCase().includes(query) ? 1.5 : 0;
  const keywordScore = brand.keywords.some(k =>
    k.toLowerCase().includes(query)
  )
    ? 1
    : 0;
  const regionBoost = brand.region === userRegion ? 1 : 0;

  return nameScore + categoryScore + keywordScore + regionBoost;
}
