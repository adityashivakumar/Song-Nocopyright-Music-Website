import Link from "next/link";
import { publicUrl } from "@/lib/cloudflare/r2";
export default function SongCard({ s }: { s: any }) {
  return (<Link href={`/music/${s.slug}`} className="group block">
    <div className="relative aspect-video overflow-hidden rounded-xl bg-chip">{s.artwork_key && <img loading="lazy" src={publicUrl(s.artwork_key)} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />}
      {s.duration && <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs">{Math.floor(s.duration / 60)}:{String(s.duration % 60).padStart(2, "0")}</span>}</div>
    <h3 className="mt-2 line-clamp-2 text-sm font-medium">{s.title}</h3><p className="text-xs text-mute">{s.artist}</p></Link>);
}
