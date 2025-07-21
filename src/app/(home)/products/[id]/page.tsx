"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  contactEmail?: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!product) return <p className="p-4">Loading product...</p>;

  return (
    <div className="p-4 space-y-4">
      <img src={product.image} alt={product.name} className="w-full rounded-xl" />
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-700">{product.description}</p>
      <p className="text-lg font-semibold">Price: ${product.price}</p>
      <p className="text-sm text-gray-500">Brand: {product.brand}</p>

      {product.contactEmail && (
        <a
          href={`mailto:${product.contactEmail}`}
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Contact Seller
        </a>
      )}
    </div>
  );
}
