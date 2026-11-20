import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { publicUrl } from "@/lib/cloudflare/r2";
import SongCard from "@/components/music/SongCard";
import PlayButton from "@/components/music/PlayButton";
export default async function Playlist({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await supabaseServer();
  const { data: p } = await db.from("playlists").select("id,title,description").eq("slug", slug).eq("is_published", true).single();
  if (!p) notFound();
  const { data: rows } = await db.from("playlist_songs").select("position, songs(*)").eq("playlist_id", p.id).order("position");
  const songs = (rows ?? []).map((r: any) => r.songs).filter(Boolean);
  const queue = songs.map((s: any) => ({ id: s.id, title: s.title, artist: s.artist, src: publicUrl(s.audio_key), artwork: publicUrl(s.artwork_key) }));
  return (
    <div>
      <h1 className="text-2xl font-bold">{p.title}</h1>
      {p.description && <p className="mb-3 text-mute">{p.description}</p>}
      {queue.length > 0 && <PlayButton track={queue[0]} queue={queue} label="Play all" />}
      {songs.length ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{songs.map((s: any) => <SongCard key={s.id} s={s} />)}</div>
      ) : <p className="mt-4 text-mute">This playlist is empty.</p>}
    </div>
  );
}