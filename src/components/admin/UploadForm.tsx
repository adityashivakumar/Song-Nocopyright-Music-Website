"use client";
import { useState } from "react";
const inp = "w-full rounded-lg border border-line bg-bg p-2 text-sm";
function put(url: string, file: File, onP?: (n: number) => void) {
  return new Promise<void>((res, rej) => { const x = new XMLHttpRequest(); x.open("PUT", url); x.setRequestHeader("Content-Type", file.type);
    x.upload.onprogress = (e) => onP?.(Math.round((e.loaded / e.total) * 100)); x.onload = () => (x.status < 300 ? res() : rej(new Error("Upload to storage failed (check R2 CORS)"))); x.onerror = () => rej(new Error("Upload blocked (check R2 CORS and keys)")); x.send(file); });
}
async function presign(kind: "audio" | "artwork", f: File) {
  const r = await fetch("/api/music/upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, contentType: f.type, size: f.size }) });
  const j = await r.json(); if (!r.ok) throw new Error(j.error ?? "Could not get upload URL"); return j as { key: string; url: string };
}
const getDuration = (f: File) => new Promise<number>((res) => { const a = new Audio(URL.createObjectURL(f)); a.onloadedmetadata = () => res(Number.isFinite(a.duration) ? Math.round(a.duration) : 0); a.onerror = () => res(0); });
export default function UploadForm({ genres }: { genres: { id: string; name: string }[] }) {
  const [audio, setAudio] = useState<File | null>(null); const [art, setArt] = useState<File | null>(null);
  const [pct, setPct] = useState(0); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget); setMsg("");
    if (!audio) return setMsg("Choose an MP3 file."); if (audio.type !== "audio/mpeg") return setMsg("File must be an MP3."); if (audio.size > 50 * 1024 * 1024) return setMsg("Max size is 50 MB.");
    setBusy(true);
    try {
      const a = await presign("audio", audio); await put(a.url, audio, setPct);
      let artwork_key: string | undefined; if (art) { const w = await presign("artwork", art); await put(w.url, art); artwork_key = w.key; }
      const body = { title: fd.get("title"), artist: fd.get("artist"), description: fd.get("description"), genre_id: fd.get("genre_id") || undefined, mood: fd.get("mood"), language: fd.get("language"), youtube_url: fd.get("youtube_url"), usage_rights: fd.get("usage_rights"), attribution_text: fd.get("attribution_text"), status: fd.get("status"), is_featured: fd.get("is_featured") === "on", audio_key: a.key, artwork_key, duration: await getDuration(audio), file_size: audio.size };
      const r = await fetch("/api/songs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error ?? "Save failed");
      setMsg("Saved ✓ Song created."); (e.target as HTMLFormElement).reset(); setAudio(null); setArt(null); setPct(0);
    } catch (err: any) { setMsg(err.message); } finally { setBusy(false); }
  }
  return (<form onSubmit={submit} className="space-y-3">
    <input name="title" required placeholder="Song title" className={inp} /><input name="artist" required placeholder="Artist" className={inp} />
    <textarea name="description" placeholder="Description" rows={3} className={inp} />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><select name="genre_id" className={inp}><option value="">No genre</option>{genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select><input name="mood" placeholder="Mood (e.g. chill)" className={inp} /><input name="language" placeholder="Language" className={inp} /></div>
    <input name="youtube_url" placeholder="YouTube link (optional)" className={inp} />
    <input name="usage_rights" placeholder="Usage rights (e.g. Original, free to use with credit)" className={inp} /><input name="attribution_text" placeholder="Attribution text" className={inp} />
    <label className="block text-sm text-mute">MP3 file<input type="file" accept="audio/mpeg,.mp3" onChange={(e) => setAudio(e.target.files?.[0] ?? null)} className="mt-1 block w-full" /></label>
    <label className="block text-sm text-mute">Artwork (JPG, PNG or WebP, optional)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setArt(e.target.files?.[0] ?? null)} className="mt-1 block w-full" /></label>
    <div className="flex items-center gap-4"><select name="status" className={inp + " max-w-40"}><option value="published">Published</option><option value="draft">Draft</option></select><label className="text-sm"><input type="checkbox" name="is_featured" /> Featured</label></div>
    {busy && <div className="h-2 rounded bg-chip"><div className="h-2 rounded bg-yt" style={{ width: `${pct}%` }} /></div>}
    {msg && <p className="text-sm">{msg}</p>}
    <button disabled={busy} className="rounded-full bg-yt px-6 py-2 font-medium disabled:opacity-50">{busy ? `Uploading ${pct}%` : "Upload & save"}</button></form>);
}
