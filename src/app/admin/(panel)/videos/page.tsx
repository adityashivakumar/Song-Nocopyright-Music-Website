import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import VideoActions from "@/components/admin/VideoActions";
import SyncButton from "@/components/admin/SyncButton";
export const dynamic = "force-dynamic";
export default async function Videos() {
  const db = await supabaseServer();
  const { data } = await db.from("videos").select("id,title,thumbnail_url,status,is_featured,source").order("created_at", { ascending: false });
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-xl font-bold">Videos</h1><Link href="/admin/videos/new" className="pill bg-yt hover:bg-yt/80">+ Add video</Link></div>
      <SyncButton />
      {data?.length ? data.map((v) => (
        <div key={v.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-surface p-3">
          <img src={v.thumbnail_url ?? ""} alt="" className="aspect-video w-24 rounded-lg bg-chip object-cover" />
          <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-medium">{v.title}</p><p className="text-xs text-mute">{v.status}{v.is_featured ? " · Featured" : ""} · {v.source}</p></div>
          <VideoActions id={v.id} status={v.status} featured={v.is_featured} />
        </div>
      )) : <p className="text-mute">No videos yet.</p>}
    </div>
  );
}
