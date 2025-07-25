'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => console.error('Failed to load products'));
  }, []);

  return (
    <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {products.map(product => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="block border p-4 rounded shadow hover:shadow-md transition"
        >
          {product.image && (
            <img src={product.image} alt={product.name} className="mb-2 w-full h-40 object-cover" />
          )}
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-sm text-gray-600">Brand: {product.brand}</p>
          <p className="text-blue-600 font-bold">${product.price}</p>
        </Link>
      ))}
    </div>
  );
}
