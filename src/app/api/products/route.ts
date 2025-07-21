import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase";

export async function POST(req: Request) {
  const data = await req.json();

  const { name, description, price, image, brand_id, region } = data;

  const { error } = await supabase.from("products").insert([
    {
      name,
      description,
      price,
      image,
      brand_id,
      region,
    },
  ]);

  if (error) {
    console.error("Error inserting product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Product added successfully" });
}

export async function GET() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
