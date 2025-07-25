import React from 'react';
import ProductList from '../components/ProductList'; // Adjust path if needed

export default function HomePage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Featured Products</h1>
      <ProductList />
    </main>
  );
}
