"use client";

import TopNav from "@/components/TopNav";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function CreateRoomPage() {
  const [roomId, setRoomId] = useState("");

  const createRoom = async () => {
    const { data } = await supabaseClient.auth.getSession();
    const token = data.session?.access_token;
    const res = await fetch("/api/rooms/create", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.json();
    setRoomId(body.roomId);
  };

  return (
    <div>
      <TopNav />
      <h2 className="mb-4 text-2xl font-semibold">Create Room</h2>
      <button onClick={createRoom}>Generate Room Code</button>
      {roomId ? <p className="mt-4">Room Code: <b>{roomId}</b></p> : null}
    </div>
  );
}
