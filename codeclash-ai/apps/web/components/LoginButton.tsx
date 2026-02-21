"use client";

import { supabaseClient } from "@/lib/supabaseClient";

export default function LoginButton() {
  const handleLogin = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  return <button onClick={handleLogin}>Login with Google</button>;
}
