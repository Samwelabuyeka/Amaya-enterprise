'use client';

import { useState, useEffect } from 'react';

type Result = {
  id: string;
  type: 'brand' | 'product';
  name: string;
  description?: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  const handleSearch = () => {
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(() => console.error('Search failed'));
  };

  useEffect(() => {
    if (query.length > 2) {
      handleSearch();
    }
  }, [query]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Search brands or products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <ul>
        {results.map((item) => (
          <li key={item.id} className="mb-2 border-b pb-2">
            <strong>{item.name}</strong> <span className="text-sm text-gray-600">({item.type})</span>
            <p className="text-gray-700">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
