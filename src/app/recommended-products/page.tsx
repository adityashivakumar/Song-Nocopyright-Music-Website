import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
export const metadata = { title: "Recommended Gear" };
export const dynamic = "force-dynamic";
export default async function Products({ searchParams }: { searchParams: Promise<{ q?: string; network?: string }> }) {
  const { q = "", network = "" } = await searchParams;
  const db = await supabaseServer();
  const { data: nets } = await db.from("affiliate_networks").select("id,name,slug");
  let query = db.from("affiliate_products").select("id,name,slug,description,image_url,affiliate_networks(name,slug)").eq("is_published", true).eq("is_active", true);
  const safe = q.replace(/[%,()]/g, " ").trim().slice(0, 60);
  if (safe) query = query.ilike("name", `%${safe}%`);
  const net = nets?.find((n) => n.slug === network);
  if (net) query = query.eq("network_id", net.id);
  const { data } = await query.order("display_order").order("created_at", { ascending: false }).limit(48);
  return (
    <div>
      <h1 className="text-2xl font-bold">Recommended Gear</h1>
      <p className="mb-3 text-xs text-mute">Affiliate links. As an Amazon Associate I earn from qualifying purchases. <Link href="/affiliate-disclosure" className="text-link">Learn more</Link></p>
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/recommended-products" className={`chip ${!net ? "bg-white text-black" : ""}`}>All</Link>
        {nets?.map((n) => <Link key={n.id} href={`/recommended-products?network=${n.slug}`} className={`chip ${net?.id === n.id ? "bg-white text-black" : ""}`}>{n.name}</Link>)}
      </div>
      <form className="mb-4 flex max-w-md"><input name="q" defaultValue={q} placeholder="Search products" className="w-full rounded-l-full border border-line bg-bg px-4 py-1.5 text-sm" /><button className="rounded-r-full border border-l-0 border-line bg-chip px-4 text-sm">Search</button></form>
      {data?.length ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data.map((p: any) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="rounded-xl bg-surface p-3 hover:bg-chip">
              {p.image_url ? <img loading="lazy" src={p.image_url} alt="" className="aspect-square w-full rounded-lg bg-white object-contain" /> : <div className="aspect-square rounded-lg bg-chip" />}
              <p className="mt-2 line-clamp-2 text-sm font-medium">{p.name}</p>
              <p className="text-xs text-mute">{p.affiliate_networks?.name}</p>
            </Link>
          ))}
        </div>
      ) : <p className="text-mute">No products found.</p>}
    </div>
  );
}