import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import BannerAd, { type AdItem } from "./BannerAd";
import { adEnabled } from "@/lib/ads";


const cta = (slug?: string) => (slug === "amazon" ? "Check on Amazon" : slug === "meesho" ? "View on Meesho" : "View product");

export default async function AdSlot({ page, layout = "banner" }: { page: string; layout?: "banner" | "strip" }) {
  const db = await supabaseServer();
  if (!(await adEnabled(db, page))) return null;
  const { data } = await db
    .from("affiliate_products")
    .select("id,name,image_url,affiliate_networks(name,slug)")
    .eq("is_published", true)
    .eq("is_active", true)
    .contains("ad_pages", [page])
    .order("display_order")
    .limit(layout === "banner" ? 5 : 4);
  if (!data?.length) return null;

  const items: AdItem[] = data.map((p: any) => ({ id: p.id, name: p.name, image_url: p.image_url, network: p.affiliate_networks?.name ?? null, cta: cta(p.affiliate_networks?.slug) }));

  if (layout === "banner")
    return (
      <div className="my-4">
        <BannerAd items={items} />
        <p className="mt-1 text-center text-[11px] text-mute">Affiliate links. We may earn a commission at no extra cost to you. <Link href="/affiliate-disclosure" className="text-link">Disclosure</Link></p>
      </div>
    );

  return (
    <section className="my-6">
      <p className="mb-2 text-xs text-mute">Recommended gear · Affiliate links. As an Amazon Associate I earn from qualifying purchases. <Link href="/affiliate-disclosure" className="text-link">Disclosure</Link></p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((p) => (
          <a key={p.id} href={`/api/affiliate/go/${p.id}`} target="_blank" rel="sponsored nofollow noopener" className="rounded-xl bg-surface p-3 hover:bg-chip">
            <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-black">Ad</span>
            {p.image_url ? <img loading="lazy" src={p.image_url} alt="" className="mt-2 aspect-square w-full rounded-lg bg-white object-contain" /> : <div className="mt-2 aspect-square rounded-lg bg-chip" />}
            <p className="mt-2 line-clamp-2 text-sm">{p.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
}