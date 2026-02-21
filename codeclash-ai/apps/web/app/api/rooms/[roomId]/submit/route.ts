import { getUserByToken } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { roomId: string } }) {
  const user = await getUserByToken(req.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const code = String(body.code || "");
  const roomId = params.roomId.toUpperCase();

  const supabase = getServiceSupabase();
  const { data: room } = await supabase.from("rooms").select("*").eq("id", roomId).single();
  if (!room || room.status !== "active") return NextResponse.json({ error: "Room inactive" }, { status: 400 });

  const { data: problem } = await supabase.from("problems").select("*").eq("id", room.problem_id).single();
  const evalRes = await fetch(`${process.env.EVALUATOR_URL}/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      function_signature: problem.function_signature,
      test_cases: problem.test_cases
    })
  });

  const result = await evalRes.json();

  await supabase.from("submissions").insert({
    room_id: roomId,
    user_id: user.id,
    score: result.score,
    execution_time: result.execution_time,
    error_message: result.error || null
  });

  return NextResponse.json(result);
}
