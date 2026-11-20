"use client";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function SignOut() {
  return <button className="chip" onClick={async () => { await supabaseBrowser().auth.signOut(); window.location.href = "/admin/login"; }}>Sign out</button>;
}
