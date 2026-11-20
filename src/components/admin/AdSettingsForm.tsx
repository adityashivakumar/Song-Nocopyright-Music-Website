
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AD_PAGES, type AdSettings } from "@/lib/ads";

export default function AdSettingsForm({ initial }: { initial: AdSettings }) {
  const r = useRouter();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [pages, setPages] = useState<Record<string, boolean>>(Object.fromEntries(AD_PAGES.map(([k]) => [k, initial.pages[k] !== false])));
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true); setMsg("");
    const res = await fetch("/api/admin/ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled, pages }) });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? "Saved ✓" : j.error ?? `Save failed (status ${res.status})`);
    if (res.ok) r.refresh();
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between rounded-xl bg-surface p-3">
        <span className="font-medium">Show ads on the website</span>
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-5 w-5 accent-red-600" />
      </label>
      <div className={`space-y-2 ${enabled ? "" : "pointer-events-none opacity-40"}`}>
        {AD_PAGES.map(([key, label]) => (
          <label key={key} className="flex items-center justify-between rounded-xl bg-surface p-3">
            <span>{label}</span>
            <input type="checkbox" checked={pages[key]} onChange={(e) => setPages({ ...pages, [key]: e.target.checked })} className="h-5 w-5 accent-red-600" />
          </label>
        ))}
      </div>
      {msg && <p className="text-sm">{msg}</p>}
      <button onClick={save} disabled={busy} className="rounded-full bg-yt px-6 py-2 font-medium disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
    </div>
  );
}