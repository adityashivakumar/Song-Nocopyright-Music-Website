"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductActions({ id, published, featured, url }: { id: string; published: boolean; featured: boolean; url: string }) {
  const r = useRouter();
  const patch = async (body: object) => { await fetch(`/api/affiliate/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); r.refresh(); };
  const del = async () => { if (!confirm("Delete this product permanently?")) return; await fetch(`/api/affiliate/products/${id}`, { method: "DELETE" }); r.refresh(); };
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/admin/products/${id}`} className="chip">Edit</Link>
      <button className="chip" onClick={() => patch({ is_published: !published })}>{published ? "Unpublish" : "Publish"}</button>
      <button className="chip" onClick={() => patch({ is_featured: !featured })}>{featured ? "Unfeature" : "Feature"}</button>
      <a className="chip" href={url} target="_blank" rel="noopener noreferrer">Test link</a>
      <button className="chip text-red-400" onClick={del}>Delete</button>
    </div>
  );
}