"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PlaylistActions({ id, published }: { id: string; published: boolean }) {
  const r = useRouter();
  const toggle = async () => { await fetch(`/api/admin/playlists/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_published: !published }) }); r.refresh(); };
  const del = async () => { if (!confirm("Delete this playlist? The songs themselves are not deleted.")) return; await fetch(`/api/admin/playlists/${id}`, { method: "DELETE" }); r.refresh(); };
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/admin/playlists/${id}`} className="chip">Edit</Link>
      <button className="chip" onClick={toggle}>{published ? "Unpublish" : "Publish"}</button>
      <button className="chip text-red-400" onClick={del}>Delete</button>
    </div>
  );
}