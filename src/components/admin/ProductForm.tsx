"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const inp = "w-full rounded-lg border border-line bg-bg p-2 text-base sm:text-sm";

async function uploadImage(f: File): Promise<string> {
  const r = await fetch("/api/music/upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "artwork", contentType: f.type, size: f.size }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error ?? `Image upload URL failed (status ${r.status})`);
  const put = await fetch(j.url, { method: "PUT", headers: { "Content-Type": f.type }, body: f });
  if (!put.ok) throw new Error("Image upload failed (check R2 CORS)");
  return j.key;
}

export default function ProductForm({ networks, categories, product }: { networks: { id: string; name: string }[]; categories: string[]; product?: any }) {
  const r = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const p = product ?? {};

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget); setBusy(true); setMsg("");
    try {
      const priceRaw = String(fd.get("price") ?? "").trim();
      const body: Record<string, unknown> = {
        name: fd.get("name"), network_id: fd.get("network_id"), affiliate_url: String(fd.get("affiliate_url")).trim(),
        original_url: fd.get("original_url") || null, description: fd.get("description") || null, brand: fd.get("brand") || null,
        category_name: fd.get("category_name") || null, price: priceRaw ? Number(priceRaw) : null,
        image_url: String(fd.get("image_url") ?? "").trim() || null, image_source: fd.get("image_source") || null, image_permission: fd.get("image_permission") || null,
        display_order: Number(fd.get("display_order") || 0), is_published: fd.get("is_published") === "on", is_featured: fd.get("is_featured") === "on",
        ad_placement: fd.get("ad_placement") || null,
        ad_pages: fd.getAll("ad_pages"),
      };
      if (file) body.image_key = await uploadImage(file);
      const res = await fetch(product ? `/api/affiliate/products/${product.id}` : "/api/affiliate/products", { method: product ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? `Save failed (status ${res.status}). Check the terminal for the error.`);
      r.push("/admin/products"); r.refresh();
    } catch (err: any) { setMsg(err.message); setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input name="name" required defaultValue={p.name} placeholder="Product name" className={inp} />
      <select name="network_id" required defaultValue={p.network_id ?? ""} className={inp}>
        <option value="" disabled>Choose affiliate network</option>
        {networks.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
      </select>
      <input name="affiliate_url" required defaultValue={p.affiliate_url} placeholder="Your affiliate link (https://...)" className={inp} />
      <input name="original_url" defaultValue={p.original_url ?? ""} placeholder="Original product page URL (optional)" className={inp} />
      <textarea name="description" defaultValue={p.description ?? ""} placeholder="Short description" rows={3} className={inp} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input name="brand" defaultValue={p.brand ?? ""} placeholder="Brand" className={inp} />
        <input name="category_name" list="cats" defaultValue={p.category_name ?? ""} placeholder="Category (e.g. Headphones)" className={inp} />
        <input name="price" type="number" step="0.01" min="0" defaultValue={p.price ?? ""} placeholder="Price ₹ (optional)" className={inp} />
      </div>
      <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
      <div className="space-y-2 rounded-xl bg-surface p-3">
        <p className="text-sm font-medium">Product image</p>
        {p.image_url && <img src={p.image_url} alt="" className="h-20 w-20 rounded-lg bg-white object-contain" />}
        <input name="image_url" defaultValue={p.image_url ?? ""} placeholder="Image URL (https://...) from your affiliate programme" className={inp} />
        <label className="block text-sm text-mute">Or upload an image you own<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full" /></label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input name="image_source" defaultValue={p.image_source ?? ""} placeholder="Image source (e.g. Amazon SiteStripe, own photo)" className={inp} />
          <input name="image_permission" defaultValue={p.image_permission ?? ""} placeholder="Permission (e.g. allowed by programme)" className={inp} />
        </div>
      </div>
      <select name="ad_placement" defaultValue={p.ad_placement ?? ""} className={inp}>
        <option value="">No ad placement</option>
        <option value="banner">Home page: wide banner (rotating)</option>
        <option value="side">Home page: side ad (right column)</option>
        <option value="strip">Home page: product strip</option>
      </select>
      <fieldset className="rounded-xl bg-surface p-3">
        <legend className="px-1 text-sm font-medium">Also show this ad on</legend>
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          {[["music", "Music page"], ["song", "Song / download page"], ["videos", "Videos page"], ["video", "Video watch page"], ["genres", "Genre pages"], ["playlists", "Playlist pages"]].map(([v, l]) => (
            <label key={v}><input type="checkbox" name="ad_pages" value={v} defaultChecked={(p.ad_pages ?? []).includes(v)} /> {l}</label>
          ))}
        </div>
      </fieldset>
      <input name="display_order" type="number" defaultValue={p.display_order ?? 0} className={inp + " max-w-40"} title="Display order (lower shows first)" />
      <div className="flex gap-5 text-sm">
        <label><input type="checkbox" name="is_published" defaultChecked={p.is_published ?? false} /> Published</label>
        <label><input type="checkbox" name="is_featured" defaultChecked={p.is_featured ?? false} /> Featured on home page</label>
      </div>
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <button disabled={busy} className="rounded-full bg-yt px-6 py-2 font-medium disabled:opacity-50">{busy ? "Saving…" : product ? "Save changes" : "Add product"}</button>
    </form>
  );
}