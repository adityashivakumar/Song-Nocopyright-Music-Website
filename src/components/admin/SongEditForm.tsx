"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const inp = "w-full rounded-lg border border-line bg-bg p-2 text-base sm:text-sm";
export default function SongEditForm({ song, genres }: { song: any; genres: { id: string; name: string }[] }) {
  const r = useRouter(); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget); setBusy(true); setMsg("");
    const s = (k: string) => String(fd.get(k) ?? "").trim() || null;
    const body = { title: String(fd.get("title") ?? "").trim(), artist: String(fd.get("artist") ?? "").trim(), description: s("description"), genre_id: s("genre_id"), mood: s("mood"), language: s("language"), youtube_url: s("youtube_url"), usage_rights: s("usage_rights"), attribution_text: s("attribution_text"), status: fd.get("status"), is_featured: fd.get("is_featured") === "on" };
    const res = await fetch(`/api/songs/${song.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(j.error ?? `Save failed (status ${res.status})`); setBusy(false); return; }
    r.push("/admin/songs"); r.refresh();
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <input name="title" required defaultValue={song.title} placeholder="Title" className={inp} />
      <input name="artist" required defaultValue={song.artist} placeholder="Artist" className={inp} />
      <textarea name="description" defaultValue={song.description ?? ""} rows={3} placeholder="Description" className={inp} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select name="genre_id" defaultValue={song.genre_id ?? ""} className={inp}><option value="">No genre</option>{genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
        <input name="mood" defaultValue={song.mood ?? ""} placeholder="Mood" className={inp} />
        <input name="language" defaultValue={song.language ?? ""} placeholder="Language" className={inp} />
      </div>
      <input name="youtube_url" defaultValue={song.youtube_video_id ? `https://www.youtube.com/watch?v=${song.youtube_video_id}` : ""} placeholder="YouTube link (optional)" className={inp} />
      <input name="usage_rights" defaultValue={song.usage_rights ?? ""} placeholder="Usage rights" className={inp} />
      <input name="attribution_text" defaultValue={song.attribution_text ?? ""} placeholder="Attribution text" className={inp} />
      <div className="flex flex-wrap items-center gap-4">
        <select name="status" defaultValue={song.status} className={inp + " max-w-44"}><option value="published">Published</option><option value="draft">Draft</option></select>
        <label className="text-sm"><input type="checkbox" name="is_featured" defaultChecked={song.is_featured} /> Featured</label>
      </div>
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <button disabled={busy} className="rounded-full bg-yt px-6 py-2 font-medium disabled:opacity-50">{busy ? "Saving…" : "Save changes"}</button>
    </form>
  );
}
