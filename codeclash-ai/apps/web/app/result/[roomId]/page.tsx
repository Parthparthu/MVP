"use client";

import TopNav from "@/components/TopNav";
import { useEffect, useState } from "react";

export default function ResultPage({ params }: { params: { roomId: string } }) {
  const [result, setResult] = useState<{ winner: string | null; submissions: Array<{ user_id: string; score: number }> } | null>(null);

  useEffect(() => {
    fetch(`/api/rooms/${params.roomId}/result`).then(async (r) => setResult(await r.json()));
  }, [params.roomId]);

  return (
    <div>
      <TopNav />
      <h2 className="mb-4 text-2xl font-semibold">Battle Result</h2>
      <p className="mb-4">Winner: <b>{result?.winner || "draw"}</b></p>
      <div className="rounded bg-panel p-4">
        {result?.submissions.map((s) => (
          <p key={s.user_id}>{s.user_id}: {s.score}</p>
        ))}
      </div>
    </div>
  );
}
