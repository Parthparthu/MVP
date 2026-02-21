import { getServiceSupabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { roomId: string } }) {
  const supabase = getServiceSupabase();
  const roomId = params.roomId.toUpperCase();

  const { data: room } = await supabase.from("rooms").select("*").eq("id", roomId).single();
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let problem = null;
  if (room.problem_id) {
    const { data } = await supabase
      .from("problems")
      .select("id,title,description,function_signature,test_cases")
      .eq("id", room.problem_id)
      .single();
    problem = data;
  }

  if (room.status === "active" && room.end_time && Date.now() >= new Date(room.end_time).getTime()) {
    await finalizeRoom(roomId);
    const { data: updated } = await supabase.from("rooms").select("*").eq("id", roomId).single();
    return NextResponse.json({ room: updated, problem });
  }

  return NextResponse.json({ room, problem });
}

async function finalizeRoom(roomId: string) {
  const supabase = getServiceSupabase();
  const { data: submissions } = await supabase
    .from("submissions")
    .select("user_id,score")
    .eq("room_id", roomId)
    .order("score", { ascending: false });

  const bestByUser = new Map<string, number>();
  for (const s of submissions || []) {
    if (!bestByUser.has(s.user_id)) bestByUser.set(s.user_id, s.score);
  }

  const ranked = [...bestByUser.entries()].sort((a, b) => b[1] - a[1]);
  const winner = ranked.length > 1 && ranked[0][1] === ranked[1][1] ? null : ranked[0]?.[0] || null;

  await supabase.from("rooms").update({ status: "completed", winner }).eq("id", roomId);

  const userIds = ranked.map((r) => r[0]);
  if (userIds.length) {
    await supabase.rpc("increment_matches", { user_ids: userIds });
  }
  if (winner) {
    await supabase.rpc("increment_wins", { winner_id: winner });
  }
}

