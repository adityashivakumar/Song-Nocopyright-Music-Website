"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const inp = "w-full rounded-lg border border-line bg-bg p-2 text-base sm:text-sm";
type S = { id: string; title: string; artist: string };

export default function PlaylistForm({ songs, playlist, selectedIds }: { songs: S[]; playlist?: any; selectedIds?: string[] }) {
  const r = useRouter();
  const [ids, setIds] = useState<string[]>(selectedIds ?? []);
  const [q, setQ] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const byId = new Map(songs.map((s) => [s.id, s]));
  const p = playlist ?? {};
  const available = songs.filter((s) => !ids.includes(s.id) && `${s.title} ${s.artist}`.toLowerCase().includes(q.toLowerCase()));
  const move = (i: number, d: number) => { const a = [...ids]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setIds(a); };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget); setBusy(true); setMsg("");
    const body = { title: fd.get("title"), description: fd.get("description") || null, is_published: fd.get("is_published") === "on", is_featured: fd.get("is_featured") === "on", song_ids: ids };
    const res = await fetch(playlist ? `/api/admin/playlists/${playlist.id}` : "/api/admin/playlists", { method: playlist ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(j.error ?? `Save failed (status ${res.status})`); setBusy(false); return; }
    r.push("/admin/playlists"); r.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input name="title" required defaultValue={p.title} placeholder="Playlist title" className={inp} />
      <textarea name="description" defaultValue={p.description ?? ""} placeholder="Description (optional)" rows={2} className={inp} />
      <div className="flex gap-5 text-sm">
        <label><input type="checkbox" name="is_published" defaultChecked={p.is_published ?? true} /> Published</label>
        <label><input type="checkbox" name="is_featured" defaultChecked={p.is_featured ?? false} /> Featured</label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-surface p-3">
          <p className="mb-2 text-sm font-medium">Add songs</p>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search songs" className={inp + " mb-2"} />
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {available.length ? available.map((s) => (
              <button type="button" key={s.id} onClick={() => setIds([...ids, s.id])} className="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm hover:bg-chip">
                <span className="truncate">{s.title} <span className="text-mute">· {s.artist}</span></span><span className="text-link">+ Add</span>
              </button>
            )) : <p className="text-sm text-mute">No songs to add.</p>}
          </div>
        </div>
        <div className="rounded-xl bg-surface p-3">
          <p className="mb-2 text-sm font-medium">In this playlist ({ids.length})</p>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {ids.length ? ids.map((id, i) => (
              <div key={id} className="flex items-center gap-2 rounded-lg bg-bg p-2 text-sm">
                <span className="w-5 text-mute">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate">{byId.get(id)?.title ?? "Unknown song"}</span>
                <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="chip">↑</button>
                <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="chip">↓</button>
                <button type="button" aria-label="Remove" onClick={() => setIds(ids.filter((x) => x !== id))} className="chip text-red-400">✕</button>
              </div>
            )) : <p className="text-sm text-mute">Add songs from the left.</p>}
          </div>
        </div>
      </div>
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <button disabled={busy} className="rounded-full bg-yt px-6 py-2 font-medium disabled:opacity-50">{busy ? "Saving…" : playlist ? "Save changes" : "Create playlist"}</button>
    </form>
  );
}