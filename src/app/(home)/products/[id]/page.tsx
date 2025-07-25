'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => console.error('Failed to load product'));
  }, [id]);

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <img src={product.image} alt={product.name} className="w-full h-auto rounded" />
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="text-lg font-semibold text-green-700 mt-4">KSh {product.price}</p>
    </div>
  );
}
