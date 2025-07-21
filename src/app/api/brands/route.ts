import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const data = await request.json();

  const { data: brand, error } = await supabase.from("brands").insert([data]);

  if (error) {
    console.error("Error inserting brand:", error);
    return NextResponse.json({ error: "Failed to register brand" }, { status: 500 });
  }

  return NextResponse.json({ success: true, brand });
}
