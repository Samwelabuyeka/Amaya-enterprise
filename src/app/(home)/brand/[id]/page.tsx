// src/app/(home)/brand/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function BrandDetailsPage() {
  const { id } = useParams();
  const [brand, setBrand] = useState<any>(null);

  useEffect(() => {
    async function fetchBrand() {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setBrand(data);
    }

    if (id) fetchBrand();
  }, [id]);

  if (!brand) return <p className="p-4">Loading brand...</p>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-2">{brand.name}</h1>
      <p className="mb-2 text-gray-600">{brand.description}</p>

      <div className="mb-4">
        <p><strong>Email:</strong> {brand.email}</p>
        <p><strong>WhatsApp:</strong> {brand.whatsapp}</p>
        <p><strong>Website:</strong> <a href={brand.website} className="text-blue-600 underline" target="_blank">{brand.website}</a></p>
        <p><strong>Region:</strong> {brand.region}</p>
        <p><strong>Dropshipping:</strong> {brand.dropshipping ? 'Yes' : 'No'}</p>
      </div>

      <Link href="/(home)/brands" className="text-blue-500 underline">← Back to brands</Link>
    </main>
  );
}
