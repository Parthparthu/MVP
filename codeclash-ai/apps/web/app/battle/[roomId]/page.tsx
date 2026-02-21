"use client";

import TopNav from "@/components/TopNav";
import CodeEditor from "@/components/CodeEditor";
import { Problem, Room } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

interface RoomData {
  room: Room;
  problem: Problem | null;
}

export default function BattleRoomPage({ params }: { params: { roomId: string } }) {
  const [data, setData] = useState<RoomData | null>(null);
  const [code, setCode] = useState("def solve(nums):\n    return nums");
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await fetch(`/api/rooms/${params.roomId}`);
    if (res.ok) {
      const body = await res.json();
      setData(body);
      if (body.room.status === "completed") {
        window.location.href = `/result/${params.roomId}`;
      }
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [params.roomId]);

  const remainingSeconds = useMemo(() => {
    if (!data?.room.end_time) return 900;
    return Math.max(0, Math.floor((new Date(data.room.end_time).getTime() - Date.now()) / 1000));
  }, [data]);

  const submit = async () => {
    const { data: authData } = await supabaseClient.auth.getSession();
    const token = authData.session?.access_token;

    const res = await fetch(`/api/rooms/${params.roomId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ code })
    });

    const body = await res.json();
    setMessage(`Score: ${body.score} | Exec: ${body.execution_time.toFixed(4)}s | Error: ${body.error || "none"}`);
  };

  return (
    <div>
      <TopNav />
      <h2 className="mb-2 text-2xl font-semibold">Battle Room: {params.roomId}</h2>
      <p className="mb-4 text-sm text-gray-300">Time left: {remainingSeconds}s</p>
      {data?.problem ? (
        <div className="mb-4 rounded bg-panel p-4">
          <h3 className="font-semibold">{data.problem.title}</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-300">{data.problem.description}</p>
          <p className="mt-2 text-sm text-blue-300">Signature: {data.problem.function_signature}</p>
        </div>
      ) : (
        <div className="mb-4 rounded bg-panel p-4">Waiting for opponent...</div>
      )}
      <CodeEditor value={code} onChange={setCode} />
      <div className="mt-4 flex items-center gap-4">
        <button onClick={submit}>Submit Solution</button>
        <span className="text-sm text-gray-300">{message}</span>
      </div>
    </div>
  );
}
