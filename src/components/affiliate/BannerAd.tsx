"use client";
import { useEffect, useState } from "react";

export type AdItem = { id: string; name: string; image_url: string | null; network: string | null; cta: string };

export default function BannerAd({ items }: { items: AdItem[] }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (items.length < 2 || hold) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length, hold]);
  if (!items.length) return null;
  const p = items[i % items.length];
  return (
    <section aria-label="Sponsored" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} className="relative">
      <a href={`/api/affiliate/go/${p.id}`} target="_blank" rel="sponsored nofollow noopener" className="flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-3 hover:bg-chip sm:gap-6 sm:p-4">
        {p.image_url ? <img src={p.image_url} alt="" className="h-24 w-24 shrink-0 rounded-xl bg-white object-contain sm:h-32 sm:w-32" /> : <div className="h-24 w-24 shrink-0 rounded-xl bg-chip sm:h-32 sm:w-32" />}
        <div className="min-w-0 flex-1">
          <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-black">Ad</span>
          <p className="mt-1 line-clamp-2 text-base font-bold sm:text-xl">{p.name}</p>
          {p.network && <p className="text-xs text-mute">{p.network}</p>}
          <span className="pill mt-2 bg-yt hover:bg-yt/80">{p.cta}</span>
        </div>
      </a>
      {items.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {items.map((_, n) => <button key={n} aria-label={`Show ad ${n + 1}`} onClick={() => setI(n)} className={`h-1.5 w-1.5 rounded-full ${n === i ? "bg-txt" : "bg-line"}`} />)}
        </div>
      )}
    </section>
  );
}