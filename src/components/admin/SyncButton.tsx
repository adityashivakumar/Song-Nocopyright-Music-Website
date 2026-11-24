"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SyncButton() {
  const r = useRouter(); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function sync() {
    setBusy(true); setMsg("");
    const res = await fetch("/api/admin/videos/sync", { method: "POST" }); const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setMsg(j.error ?? `Sync failed (status ${res.status})`);
    setMsg(`Checked ${j.checked} videos. New ones were added as drafts.`); r.refresh();
  }
  return <div><button onClick={sync} disabled={busy} className="pill disabled:opacity-50">{busy ? "Syncing…" : "Sync from YouTube channel"}</button>{msg && <p className="mt-1 text-xs text-mute">{msg}</p>}</div>;
}
