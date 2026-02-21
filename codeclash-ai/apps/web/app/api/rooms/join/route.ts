import { getUserByToken } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getUserByToken(req.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const roomId = String(body.roomId || "").toUpperCase();
  const supabase = getServiceSupabase();

  const { data: room, error: roomError } = await supabase.from("rooms").select("*").eq("id", roomId).single();
  if (roomError || !room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  if (room.player2) return NextResponse.json({ error: "Room full" }, { status: 400 });

  const { data: problem } = await supabase.from("problems").select("id").limit(1).order("id", { ascending: true }).single();
  const endTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("rooms")
    .update({
      player2: user.id,
      status: "active",
      problem_id: problem?.id,
      end_time: endTime
    })
    .eq("id", roomId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
