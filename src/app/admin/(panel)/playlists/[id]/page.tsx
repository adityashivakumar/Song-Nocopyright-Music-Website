import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import PlaylistForm from "@/components/admin/PlaylistForm";
export const dynamic = "force-dynamic";

export default async function EditPlaylist({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await supabaseServer();
  const [{ data: p }, { data: songs }, { data: rows }] = await Promise.all([
    db.from("playlists").select("*").eq("id", id).single(),
    db.from("songs").select("id,title,artist").order("title"),
    db.from("playlist_songs").select("song_id").eq("playlist_id", id).order("position"),
  ]);
  if (!p) notFound();
  return <div><h1 className="mb-3 text-xl font-bold">Edit playlist</h1><PlaylistForm songs={songs ?? []} playlist={p} selectedIds={(rows ?? []).map((r) => r.song_id)} /></div>;
}