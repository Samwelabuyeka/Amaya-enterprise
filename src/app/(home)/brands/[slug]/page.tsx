'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Brand = {
  id: string;
  name: string;
  description: string;
  region: string;
  category: string;
  contact: string;
};

export default function BrandDetailPage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    fetch(`/api/brands/${slug}`)
      .then(res => res.json())
      .then(data => setBrand(data))
      .catch(() => console.error('Failed to load brand'));
  }, [slug]);

  if (!brand) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{brand.name}</h1>
      <p className="text-gray-700 mt-2">{brand.description}</p>
      <p className="text-sm mt-2">Region: {brand.region}</p>
      <p className="text-sm">Category: {brand.category}</p>
      <p className="text-blue-600 mt-4">Contact: {brand.contact}</p>
    </div>
  );
}
