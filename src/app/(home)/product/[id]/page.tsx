import React from 'react';
import { useParams } from 'next/navigation';

const ProductDetailsPage = () => {
  const params = useParams();
  const productId = params?.id;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Product Details</h1>
      <p>Viewing details for product: <strong>{productId}</strong></p>
      {/* You can later fetch product details using the ID */}
    </main>
  );
};

export default ProductDetailsPage;
