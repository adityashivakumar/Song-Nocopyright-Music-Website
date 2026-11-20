import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import ProductActions from "@/components/admin/ProductActions";
export const dynamic = "force-dynamic";

export default async function Products() {
  const db = await supabaseServer();
  const [{ data }, { data: clicks }] = await Promise.all([
    db.from("affiliate_products").select("id,name,image_url,is_published,is_featured,affiliate_url,affiliate_networks(name)").order("created_at", { ascending: false }),
    db.from("affiliate_clicks").select("product_id").limit(50000),
  ]);
  const count: Record<string, number> = {};
  clicks?.forEach((c) => { if (c.product_id) count[c.product_id] = (count[c.product_id] ?? 0) + 1; });
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Affiliate products</h1><Link href="/admin/products/new" className="pill bg-yt hover:bg-yt/80">+ Add product</Link></div>
      {data?.length ? data.map((p: any) => (
        <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-surface p-3">
          {p.image_url ? <img src={p.image_url} alt="" className="h-14 w-14 rounded-lg bg-white object-contain" /> : <div className="h-14 w-14 rounded-lg bg-chip" />}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{p.name}</p>
            <p className="text-xs text-mute">{p.affiliate_networks?.name} · {p.is_published ? "Published" : "Draft"}{p.is_featured ? " · Featured" : ""} · {count[p.id] ?? 0} clicks</p>
          </div>
          <ProductActions id={p.id} published={p.is_published} featured={p.is_featured} url={p.affiliate_url} />
        </div>
      )) : <p className="text-mute">No products yet. Click “Add product”.</p>}
    </div>
  );
}