import { supabaseServer } from "@/lib/supabase/server";
export async function requireAdmin() {
  const s = await supabaseServer();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return null;
  const { data } = await s.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin" ? user : null;
}
