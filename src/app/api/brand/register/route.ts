// src/app/api/brand/register/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, website, region, dropshipping, category } = body;

  const { data, error } = await supabase
    .from('brands')
    .insert([{ name, email, website, region, dropshipping, category }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
