import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabaseClient';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const [brands, products] = await Promise.all([
    supabase.from('brands')
      .select('*')
      .ilike('name', `%${query}%`),
    supabase.from('products')
      .select('*')
      .ilike('name', `%${query}%`)
  ]);

  return NextResponse.json({
    brands: brands.data || [],
    products: products.data || [],
  });
}
