import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import PlaylistActions from "@/components/admin/PlaylistActions";
export const dynamic = "force-dynamic";

export default async function Playlists() {
  const db = await supabaseServer();
  const { data } = await db.from("playlists").select("id,title,is_published,is_featured,playlist_songs(count)").order("created_at", { ascending: false });
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Playlists</h1><Link href="/admin/playlists/new" className="pill bg-yt hover:bg-yt/80">+ New playlist</Link></div>
      {data?.length ? data.map((p: any) => (
        <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-surface p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{p.title}</p>
            <p className="text-xs text-mute">{p.playlist_songs?.[0]?.count ?? 0} songs · {p.is_published ? "Published" : "Draft"}{p.is_featured ? " · Featured" : ""}</p>
          </div>
          <PlaylistActions id={p.id} published={p.is_published} />
        </div>
      )) : <p className="text-mute">No playlists yet. Click “New playlist”.</p>}
    </div>
  );
}