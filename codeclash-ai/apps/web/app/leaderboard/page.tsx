"use client";

import TopNav from "@/components/TopNav";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  name: string;
  rating: number;
  total_wins: number;
  total_matches: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard").then(async (r) => setEntries(await r.json()));
  }, []);

  return (
    <div>
      <TopNav />
      <h2 className="mb-4 text-2xl font-semibold">Leaderboard</h2>
      <div className="rounded bg-panel p-4">
        {entries.map((e) => (
          <p key={e.name}>{e.name} - rating {e.rating} | wins {e.total_wins}/{e.total_matches}</p>
        ))}
      </div>
    </div>
  );
}
