import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import SongCard from "@/components/music/SongCard";
import BannerAd, { type AdItem } from "@/components/affiliate/BannerAd";
import SideAds from "@/components/affiliate/SideAds";
export const dynamic = "force-dynamic";
import { adEnabled } from "@/lib/ads";
import RightRail from "@/components/affiliate/RightRail";

const cta = (slug?: string) => (slug === "amazon" ? "Check on Amazon" : slug === "meesho" ? "View on Meesho" : "View product");
const toAd = (p: any): AdItem => ({ id: p.id, name: p.name, image_url: p.image_url, network: p.affiliate_networks?.name ?? null, cta: cta(p.affiliate_networks?.slug) });

export default async function Home() {
  const db = await supabaseServer();
  
  const adSelect = "id,name,image_url,ad_placement,is_featured,affiliate_networks(name,slug)";
  const [{ data: genres }, { data: latest }, { data: popular }, { data: vids }, { data: ads }] = await Promise.all([
    db.from("genres").select("name,slug").eq("is_active", true),
    db.from("songs").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(8),
    db.from("songs").select("*").eq("status", "published").gt("play_count", 0).order("play_count", { ascending: false }).limit(8),
    db.from("videos").select("title,slug,thumbnail_url").eq("status", "published").order("published_at", { ascending: false }).limit(4),
    db.from("affiliate_products").select(adSelect).eq("is_published", true).eq("is_active", true).order("display_order").limit(60),
  ]);
  const { data: yt } = await db.from("site_settings").select("setting_value").eq("setting_key", "youtube").maybeSingle();
const h = yt?.setting_value?.handle as string | undefined;
const sub = h ? `https://www.youtube.com/@${h.replace("@", "")}?sub_confirmation=1` : null;
  const showAds = await adEnabled(db, "home");
const all = showAds ? (ads ?? []) : [];
  const banner = all.filter((p: any) => p.ad_placement === "banner").slice(0, 5).map(toAd);
  const side = all.filter((p: any) => p.ad_placement === "side").slice(0, 3).map(toAd);
  const strip = all.filter((p: any) => p.ad_placement === "strip" || p.is_featured).slice(0, 4);

  const Grid = ({ items }: { items?: any[] | null }) =>
    items?.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((s) => <SongCard key={s.id} s={s} />)}</div> : <p className="text-mute">Nothing here yet.</p>;

  return (
    <div className="mx-auto max-w-[1700px] xl:grid xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-6">
      <div className="min-w-0 space-y-8">
        
        <div className="flex gap-2 overflow-x-auto py-2">
          <Link href="/music" className="chip bg-white text-black">All</Link>
          {genres?.map((g) => <Link key={g.slug} href={`/genres/${g.slug}`} className="chip">{g.name}</Link>)}
        </div>
        <section className="rounded-2xl bg-gradient-to-br from-yt/30 to-surface p-8">
          <h1 className="text-3xl font-bold">Discover Music. Feel Every Moment.</h1>
          <p className="mt-2 text-mute">Explore a collection of music, discover new sounds and download your favourites.</p>
          <div className="mt-4 flex gap-3"><Link href="/music" className="pill bg-white text-black">Explore Music</Link><Link href="/music?sort=latest" className="pill">Latest Releases</Link></div>
        </section>

        <BannerAd items={banner} />

        <section><h2 className="mb-3 text-xl font-bold">Latest releases</h2><Grid items={latest} /></section>
        <section><h2 className="mb-3 text-xl font-bold">Popular</h2><Grid items={popular} /></section>
        <section>
          <h2 className="mb-3 text-xl font-bold">From the channel</h2>
          {vids?.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {vids.map((v) => <Link key={v.slug} href={`/videos/${v.slug}`}><img src={v.thumbnail_url ?? ""} alt="" className="aspect-video w-full rounded-xl object-cover" /><p className="mt-2 text-sm font-medium">{v.title}</p></Link>)}
            </div>
          ) : <p className="text-mute">No videos yet.</p>}
        </section>

        {strip.length > 0 && (
          <section>
            <h2 className="mb-1 text-xl font-bold">Recommended gear</h2>
            <p className="mb-3 text-xs text-mute">Affiliate links. As an Amazon Associate I earn from qualifying purchases. <Link href="/affiliate-disclosure" className="text-link">Learn more</Link></p>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {strip.map((p: any) => (
                <a key={p.id} href={`/api/affiliate/go/${p.id}`} target="_blank" rel="sponsored nofollow noopener" className="rounded-xl bg-surface p-3 hover:bg-chip">
                  <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-black">Ad</span>
                  {p.image_url ? <img loading="lazy" src={p.image_url} alt="" className="mt-2 aspect-square w-full rounded-lg bg-white object-contain" /> : <div className="mt-2 aspect-square rounded-lg bg-chip" />}
                  <p className="mt-2 line-clamp-2 text-sm">{p.name}</p>
                </a>
              ))}
            </div>
          </section>
        )}
        {(banner.length > 0 || side.length > 0) && <p className="text-xs text-mute">Sponsored links above are affiliate links. We may earn a commission at no extra cost to you. <Link href="/affiliate-disclosure" className="text-link">Disclosure</Link></p>}
      </div>
      <aside className="hidden xl:block"><RightRail ads={side} videos={vids ?? []} sub={sub} /></aside>
    </div>
  );
}