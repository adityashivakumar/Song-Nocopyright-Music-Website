"use client";
import { useState } from "react";
const inp = "w-full rounded-lg border border-line bg-bg p-2 text-sm";
export default function VideoForm({ songs }: { songs: { id: string; title: string }[] }) {
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget); setBusy(true); setMsg("");
    const r = await fetch("/api/admin/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: fd.get("url"), title: fd.get("title") || undefined, description: fd.get("description") || undefined, song_id: fd.get("song_id") || null, status: fd.get("status"), is_featured: fd.get("is_featured") === "on" }) });
    const j = await r.json(); setBusy(false);
    if (r.ok) { setMsg(`Saved ✓ ${j.title}`); (e.target as HTMLFormElement).reset(); } else setMsg(j.error ?? "Failed");
  }
  return (<form onSubmit={submit} className="space-y-3">
    <input name="url" required placeholder="Paste YouTube link (watch, youtu.be or shorts)" className={inp} />
    <input name="title" placeholder="Title (leave empty to use the YouTube title)" className={inp} /><textarea name="description" placeholder="Description" rows={3} className={inp} />
    <select name="song_id" className={inp}><option value="">No linked song</option>{songs.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}</select>
    <div className="flex items-center gap-4"><select name="status" className={inp + " max-w-40"}><option value="published">Published</option><option value="draft">Draft</option></select><label className="text-sm"><input type="checkbox" name="is_featured" /> Featured</label></div>
    {msg && <p className="text-sm">{msg}</p>}<button disabled={busy} className="rounded-full bg-yt px-6 py-2 font-medium disabled:opacity-50">{busy ? "Saving…" : "Add video"}</button></form>);
}
