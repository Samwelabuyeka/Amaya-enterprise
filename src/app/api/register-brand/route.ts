import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabaseClient';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, category, region, website, contactEmail, dropshipping } = body;

  if (!name || !category || !region) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase.from('brands').insert([
    {
      name,
      category,
      region,
      website,
      contact_email: contactEmail,
      dropshipping,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, brand: data?.[0] });
}
