"use client";

import TopNav from "@/components/TopNav";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function JoinRoomPage() {
  const [roomId, setRoomId] = useState("");

  const joinRoom = async () => {
    const { data } = await supabaseClient.auth.getSession();
    const token = data.session?.access_token;

    const res = await fetch("/api/rooms/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ roomId })
    });

    if (res.ok) window.location.href = `/battle/${roomId}`;
  };

  return (
    <div>
      <TopNav />
      <h2 className="mb-4 text-2xl font-semibold">Join Room</h2>
      <div className="flex gap-3">
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room code" />
        <button onClick={joinRoom}>Join</button>
      </div>
    </div>
  );
}
