import { getServiceSupabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("users")
    .select("name,rating,total_wins,total_matches")
    .order("rating", { ascending: false })
    .limit(20);

  return NextResponse.json(data || []);
}
