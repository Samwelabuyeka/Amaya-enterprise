'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Brand = {
  id: string;
  name: string;
  category: string;
  region: string;
  contact: string;
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(() => console.error('Failed to load brands.'));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Brands</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <Link
            href={`/brand/${brand.id}`}
            key={brand.id}
            className="border rounded-xl p-4 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">{brand.name}</h2>
            <p className="text-sm text-gray-500">{brand.category} • {brand.region}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
