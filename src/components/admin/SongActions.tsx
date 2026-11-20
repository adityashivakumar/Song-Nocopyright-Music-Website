"use client";
import { useRouter } from "next/navigation";
export default function SongActions({ id, status }: { id: string; status: string }) {
  const r = useRouter();
  const toggle = async () => { await fetch(`/api/songs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: status === "published" ? "draft" : "published" }) }); r.refresh(); };
  const del = async () => { if (!confirm("Delete this song permanently?")) return; await fetch(`/api/songs/${id}`, { method: "DELETE" }); r.refresh(); };
  return <div className="flex gap-2"><button className="chip" onClick={toggle}>{status === "published" ? "Unpublish" : "Publish"}</button><button className="chip text-red-400" onClick={del}>Delete</button></div>;
}
