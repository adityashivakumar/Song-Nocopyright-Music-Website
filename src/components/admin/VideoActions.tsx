"use client";
import { useRouter } from "next/navigation";
export default function VideoActions({ id, status, featured }: { id: string; status: string; featured: boolean }) {
  const r = useRouter();
  async function call(method: string, body?: object) {
    const res = await fetch(`/api/admin/videos/${id}`, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) alert("Action failed. Please try again."); else r.refresh();
  }
  return (
    <div className="flex flex-wrap gap-2">
      <button className="chip" onClick={() => call("PATCH", { status: status === "published" ? "draft" : "published" })}>{status === "published" ? "Unpublish" : "Publish"}</button>
      <button className="chip" onClick={() => call("PATCH", { is_featured: !featured })}>{featured ? "Unfeature" : "Feature"}</button>
      <button className="chip text-red-400" onClick={() => { if (confirm("Delete this video from the website?")) call("DELETE"); }}>Delete</button>
    </div>
  );
}
