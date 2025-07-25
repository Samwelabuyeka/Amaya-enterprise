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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load brands:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Explore Brands</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {brands.map((brand) => (
            <li key={brand.id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold">{brand.name}</h2>
              <p className="text-gray-600">Category: {brand.category}</p>
              <p className="text-gray-600">Region: {brand.region}</p>
              <p className="text-gray-600">Contact: {brand.contact}</p>
              <Link
                href={`/brands/${brand.id}`}
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
