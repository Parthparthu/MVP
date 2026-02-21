import { getServiceSupabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { roomId: string } }) {
  const supabase = getServiceSupabase();
  const roomId = params.roomId.toUpperCase();

  const { data: room } = await supabase.from("rooms").select("winner").eq("id", roomId).single();
  const { data: submissions } = await supabase
    .from("submissions")
    .select("user_id,score")
    .eq("room_id", roomId)
    .order("score", { ascending: false });

  return NextResponse.json({ winner: room?.winner || null, submissions: submissions || [] });
}
