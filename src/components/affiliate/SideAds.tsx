import type { AdItem } from "./BannerAd";

export default function SideAds({ items }: { items: AdItem[] }) {
  if (!items.length) return null;
  return (
    <div className="sticky top-16 space-y-4">
      {items.map((p) => (
        <a key={p.id} href={`/api/affiliate/go/${p.id}`} target="_blank" rel="sponsored nofollow noopener" className="block rounded-xl border border-line bg-surface p-3 hover:bg-chip">
          <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-black">Ad</span>
          {p.image_url ? <img loading="lazy" src={p.image_url} alt="" className="mt-2 aspect-square w-full rounded-lg bg-white object-contain" /> : <div className="mt-2 aspect-square rounded-lg bg-chip" />}
          <p className="mt-2 line-clamp-2 text-sm font-medium">{p.name}</p>
          <span className="pill mt-2 w-full justify-center bg-yt text-xs hover:bg-yt/80">{p.cta}</span>
        </a>
      ))}
    </div>
  );
}