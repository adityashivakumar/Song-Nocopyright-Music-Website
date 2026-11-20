import { supabaseServer } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function Dash() {
  const db = await supabaseServer();
  const c = async (t: string, f?: (q: any) => any) => { let q = db.from(t).select("*", { count: "exact", head: true }); if (f) q = f(q); return (await q).count ?? 0; };
  const stats = [["Published songs", await c("songs", (q) => q.eq("status", "published"))], ["Draft songs", await c("songs", (q) => q.eq("status", "draft"))], ["Videos", await c("videos")], ["Downloads", await c("downloads")], ["Affiliate products", await c("affiliate_products")], ["Affiliate clicks", await c("affiliate_clicks")]];
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{stats.map(([l, n]) => <div key={l} className="rounded-xl bg-surface p-4"><p className="text-2xl font-bold">{n}</p><p className="text-sm text-mute">{l}</p></div>)}</div>;
}
