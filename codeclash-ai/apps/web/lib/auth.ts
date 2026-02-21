import { getServiceSupabase } from "./supabaseServer";

export async function getUserByToken(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  await supabase.from("users").upsert({
    id: data.user.id,
    name: data.user.user_metadata?.full_name || data.user.email || "Player",
    email: data.user.email || `${data.user.id}@local`
  });

  return data.user;
}
