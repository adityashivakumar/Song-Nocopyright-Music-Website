"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function SongActions({ id, status }: { id: string; status: string }) {
  const r = useRouter();
  async function call(method: string, body?: object) {
    const res = await fetch(`/api/songs/${id}`, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) alert("Action failed. Please try again."); else r.refresh();
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/admin/songs/${id}`} className="chip">Edit</Link>
      <button className="chip" onClick={() => call("PATCH", { status: status === "published" ? "draft" : "published" })}>{status === "published" ? "Unpublish" : "Publish"}</button>
      <button className="chip text-red-400" onClick={() => { if (confirm("Delete this song permanently?")) call("DELETE"); }}>Delete</button>
    </div>
  );
}
