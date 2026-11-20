import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import AdSlot from "@/components/affiliate/AdSlot";

export default async function Videos() {
  const db = await supabaseServer();
  const { data } = await db
    .from("videos")
    .select("title,slug,thumbnail_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(48);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Videos</h1>
      <AdSlot page="videos" />
      {data?.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((v) => (
            <Link key={v.slug} href={`/videos/${v.slug}`}>
              <img loading="lazy" src={v.thumbnail_url ?? ""} alt="" className="aspect-video w-full rounded-xl object-cover" />
              <p className="mt-2 line-clamp-2 text-sm font-medium">{v.title}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-mute">No videos published yet.</p>
      )}
    </div>
  );
}