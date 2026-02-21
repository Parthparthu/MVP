import { getUserByToken } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabaseServer";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getUserByToken(req.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceSupabase();
  const roomId = randomUUID().slice(0, 8).toUpperCase();

  const { error } = await supabase.from("rooms").insert({
    id: roomId,
    player1: user.id,
    status: "waiting"
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ roomId });
}
