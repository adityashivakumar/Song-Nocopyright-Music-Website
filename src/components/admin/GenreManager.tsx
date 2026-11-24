"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const inp = "w-full rounded-lg border border-line bg-bg p-2 text-base sm:text-sm";
type G = { id: string; name: string; is_active: boolean };
export default function GenreManager({ genres }: { genres: G[] }) {
  const r = useRouter(); const [name, setName] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function call(url: string, method: string, body?: object) {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error ?? `Failed (status ${res.status})`);
  }
  async function add(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    try { await call("/api/admin/genres", "POST", { name }); setName(""); r.refresh(); } catch (err: any) { setMsg(err.message); }
    setBusy(false);
  }
  async function act(fn: () => Promise<void>) { try { await fn(); r.refresh(); } catch (err: any) { setMsg(err.message); } }
  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="New genre (e.g. Lo-fi)" className={inp} />
        <button disabled={busy} className="shrink-0 rounded-full bg-yt px-5 py-2 font-medium disabled:opacity-50">Add</button>
      </form>
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <div className="space-y-2">
        {genres.length ? genres.map((g) => (
          <div key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-surface p-3">
            <p className="min-w-0 flex-1 truncate font-medium">{g.name} <span className="text-xs text-mute">{g.is_active ? "" : "(hidden)"}</span></p>
            <button className="chip" onClick={() => act(() => call(`/api/admin/genres/${g.id}`, "PATCH", { is_active: !g.is_active }))}>{g.is_active ? "Hide" : "Show"}</button>
            <button className="chip text-red-400" onClick={() => { if (confirm(`Delete genre "${g.name}"? Songs keep existing but lose this genre.`)) act(() => call(`/api/admin/genres/${g.id}`, "DELETE")); }}>Delete</button>
          </div>
        )) : <p className="text-mute">No genres yet. Add one above.</p>}
      </div>
    </div>
  );
}
