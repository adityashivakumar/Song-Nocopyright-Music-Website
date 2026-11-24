"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setBusy(false); return; }
    window.location.href = "/admin";
  }
  return (<form onSubmit={submit} className="mx-auto mt-20 max-w-sm space-y-3 rounded-2xl bg-surface p-6">
    <h1 className="text-xl font-bold">Admin login</h1>
    <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-line bg-bg p-2 text-base" />
    <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-line bg-bg p-2 text-base" />
    {err && <p className="text-sm text-red-400">{err}</p>}
    <button disabled={busy} className="w-full rounded-full bg-yt py-2 font-medium disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button></form>);
}
