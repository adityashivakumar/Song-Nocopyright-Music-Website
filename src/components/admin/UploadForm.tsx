"use client";
import { useState } from "react";
const inp = "w-full rounded-lg border border-line bg-bg p-2 text-base sm:text-sm";
const MAX = 100 * 1024 * 1024;

function put(url: string, file: File, contentType: string, onP?: (n: number) => void) {
  return new Promise<void>((res, rej) => {
    const x = new XMLHttpRequest(); x.open("PUT", url); x.setRequestHeader("Content-Type", contentType);
    x.upload.onprogress = (e) => { if (e.lengthComputable) onP?.(Math.round((e.loaded / e.total) * 100)); };
    x.onload = () => (x.status < 300 ? res() : rej(new Error(`Upload to storage failed (status ${x.status}). Check the R2 CORS settings.`)));
    x.onerror = () => rej(new Error("Upload blocked. Check your connection and the R2 CORS settings."));
    x.send(file);
  });
}
async function presign(kind: "audio" | "artwork", contentType: string, size: number) {
  const r = await fetch("/api/music/upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, contentType, size }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(r.status === 401 ? "You are logged out. Please log in again." : j.error ?? `Could not get upload URL (status ${r.status})`);
  return j as { key: string; url: string };
}
const imageType = (f: File) => (f.type && f.type.startsWith("image/") ? f.type : /\.png$/i.test(f.name) ? "image/png" : /\.webp$/i.test(f.name) ? "image/webp" : /\.jpe?g$/i.test(f.name) ? "image/jpeg" : "");
const isMp3 = (f: File) => /\.mp3$/i.test(f.name) || /audio\/(mpeg|mp3)/.test(f.type);
const getDuration = (f: File) => new Promise<number>((res) => {
  const a = new Audio(); a.preload = "metadata"; const u = URL.createObjectURL(f); a.src = u;
  const done = (n: number) => { URL.revokeObjectURL(u); res(n); };
  a.onloadedmetadata = () => done(Number.isFinite(a.duration) ? Math.round(a.duration) : 0); a.onerror = () => done(0); setTimeout(() => done(0), 5000);
});

export default function UploadForm({ genres }: { genres: { id: string; name: string }[] }) {
  const [audio, setAudio] = useState<File | null>(null); const [art, setArt] = useState<File | null>(null);
  const [pct, setPct] = useState(0); const [step, setStep] = useState(""); const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const fd = new FormData(form); setMsg(""); setOk(false);
    if (!audio) return setMsg("Choose an MP3 file.");
    if (!isMp3(audio)) return setMsg("The audio file must be an MP3 (.mp3).");
    if (audio.size > MAX) return setMsg("The MP3 is larger than 100 MB.");
    let artType = ""; if (art) { artType = imageType(art); if (!artType) return setMsg("Artwork must be a JPG, PNG or WebP image (HEIC is not supported)."); }
    setBusy(true);
    try {
      setStep("Uploading MP3…"); const a = await presign("audio", "audio/mpeg", audio.size); await put(a.url, audio, "audio/mpeg", setPct);
      let artwork_key: string | undefined;
      if (art) { setStep("Uploading artwork…"); const w = await presign("artwork", artType, art.size); await put(w.url, art, artType); artwork_key = w.key; }
      setStep("Saving…");
      const t = (k: string) => String(fd.get(k) ?? "").trim() || undefined;
      const body = { title: String(fd.get("title") ?? "").trim(), artist: String(fd.get("artist") ?? "").trim(), description: t("description"), genre_id: t("genre_id"), mood: t("mood"), language: t("language"), youtube_url: t("youtube_url"), usage_rights: t("usage_rights"), attribution_text: t("attribution_text"), status: fd.get("status"), is_featured: fd.get("is_featured") === "on", audio_key: a.key, artwork_key, duration: await getDuration(audio), file_size: audio.size };
      const r = await fetch("/api/songs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error ?? `Save failed (status ${r.status})`);
      setOk(true); setMsg("Saved ✓ The song was created."); form.reset(); setAudio(null); setArt(null); setPct(0);
    } catch (err: any) { setMsg(err.message ?? "Something went wrong"); } finally { setBusy(false); setStep(""); }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input name="title" required placeholder="Song title" className={inp} />
      <input name="artist" required placeholder="Artist" className={inp} />
      <textarea name="description" placeholder="Description" rows={3} className={inp} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select name="genre_id" className={inp}><option value="">No genre</option>{genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
        <input name="mood" placeholder="Mood (e.g. chill)" className={inp} />
        <input name="language" placeholder="Language" className={inp} />
      </div>
      <input name="youtube_url" placeholder="YouTube link (optional)" className={inp} />
      <input name="usage_rights" placeholder="Usage rights (e.g. Original, free to use with credit)" className={inp} />
      <input name="attribution_text" placeholder="Attribution text" className={inp} />
      <label className="block text-sm text-mute">MP3 file<input type="file" accept="audio/mpeg,audio/mp3,.mp3" onChange={(e) => setAudio(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-base" /></label>
      <label className="block text-sm text-mute">Artwork (JPG, PNG or WebP, optional)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setArt(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-base" /></label>
      <div className="flex flex-wrap items-center gap-4">
        <select name="status" className={inp + " max-w-44"}><option value="published">Published</option><option value="draft">Draft</option></select>
        <label className="text-sm"><input type="checkbox" name="is_featured" /> Featured</label>
      </div>
      {busy && <div><p className="mb-1 text-xs text-mute">{step} {step.startsWith("Uploading MP3") ? `${pct}%` : ""}</p><div className="h-2 rounded bg-chip"><div className="h-2 rounded bg-yt" style={{ width: `${pct}%` }} /></div></div>}
      {msg && <p className={`text-sm ${ok ? "text-green-400" : "text-red-400"}`}>{msg}</p>}
      <button disabled={busy} className="w-full rounded-full bg-yt px-6 py-3 font-medium disabled:opacity-50 sm:w-auto">{busy ? "Please wait…" : "Upload & save"}</button>
    </form>
  );
}
