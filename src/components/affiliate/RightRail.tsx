
import Link from "next/link";
import SideAds from "./SideAds";
import type { AdItem } from "./BannerAd";

type Vid = { title: string; slug: string; thumbnail_url: string | null };

export default function RightRail({ ads, videos, sub }: { ads: AdItem[]; videos: Vid[]; sub: string | null }) {
  return (
    <div className="sticky top-16 space-y-4">
      {sub && (
        <a href={sub} target="_blank" rel="noopener noreferrer" className="block rounded-xl bg-gradient-to-br from-yt/40 to-surface p-4 text-center hover:opacity-90">
          <p className="text-sm font-bold">New songs every month</p>
          <p className="mt-1 text-xs text-mute">Subscribe to our YouTube channel</p>
          <span className="pill mt-3 bg-yt hover:bg-yt/80">Subscribe</span>
        </a>
      )}

      {videos.length > 0 && (
        <div className="rounded-xl bg-surface p-3">
          <h3 className="mb-2 text-sm font-bold">Latest videos</h3>
          <div className="space-y-3">
            {videos.slice(0, 4).map((v) => (
              <Link key={v.slug} href={`/videos/${v.slug}`} className="flex gap-2 hover:opacity-90">
                <img loading="lazy" src={v.thumbnail_url ?? ""} alt="" className="aspect-video w-24 shrink-0 rounded-lg object-cover" />
                <p className="line-clamp-3 text-xs font-medium">{v.title}</p>
              </Link>
            ))}
          </div>
          <Link href="/videos" className="mt-3 block text-xs text-link">See all videos</Link>
        </div>
      )}

      <SideAds items={ads} />
    </div>
  );
}