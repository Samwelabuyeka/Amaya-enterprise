import React, { useState } from 'react';

export default function SearchBar({ onResults }: { onResults?: (r: any[]) => void }) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(json.results || []);
      if (onResults) onResults(json.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brands, products..." className="flex-1 p-3 rounded-lg border" />
        <button onClick={(e) => handleSearch(e)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">{loading ? 'Searching...' : 'Search'}</button>
      </form>
      {results.length > 0 && (
        <div className="mt-4 bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
          {results.map((r, i) => (
            <div key={i} className="py-2 border-b last:border-b-0">
              <div className="text-sm text-zinc-500">{r.type}</div>
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-zinc-400">{r.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
