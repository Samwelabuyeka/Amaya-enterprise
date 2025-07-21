"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get("q");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Search Results</h1>
      <p className="mt-1 text-gray-600">You searched for: <strong>{query}</strong></p>

      {/* TODO: Add real search logic */}
      <div className="mt-4">
        <p>No results found. (This will show products and brands once search is hooked)</p>
      </div>
    </div>
  );
}
