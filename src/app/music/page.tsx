import { supabaseServer } from "@/lib/supabase/server";
import SongCard from "@/components/music/SongCard";
import Link from "next/link";
import AdSlot from "@/components/affiliate/AdSlot";

const PER = 24;

export default async function Music({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string; page?: string }> }) {
  const { q = "", sort = "latest", page = "1" } = await searchParams;
  const pg = Math.max(1, parseInt(page) || 1);
  const db = await supabaseServer();
  const enc = encodeURIComponent(q);

  let query = db.from("songs").select("*", { count: "exact" }).eq("status", "published");
  const safe = q.replace(/[%,()]/g, " ").slice(0, 60);
  if (safe.trim()) query = query.or(`title.ilike.%${safe}%,artist.ilike.%${safe}%`);
  const { data, count } = await query
    .order(sort === "popular" ? "play_count" : "created_at", { ascending: false })
    .range((pg - 1) * PER, pg * PER - 1);

  return (
    <>
      <div>
        <h1 className="mb-3 text-2xl font-bold">Music</h1>
        <AdSlot page="music" />
        <div className="mb-4 flex gap-2">
          <Link className="chip" href={`/music?q=${enc}&sort=latest`}>Latest</Link>
          <Link className="chip" href={`/music?q=${enc}&sort=popular`}>Popular</Link>
        </div>
        {data?.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{data.map((s) => <SongCard key={s.id} s={s} />)}</div>
        ) : (
          <p className="text-mute">No songs found.</p>
        )}
        <div className="mt-6 flex gap-3">
          {pg > 1 && <Link className="pill" href={`/music?q=${enc}&sort=${sort}&page=${pg - 1}`}>Previous</Link>}
          {(count ?? 0) > pg * PER && <Link className="pill" href={`/music?q=${enc}&sort=${sort}&page=${pg + 1}`}>Next</Link>}
        </div>
      </div>
      <AdSlot page="music" layout="strip" />
    </>
  );
}