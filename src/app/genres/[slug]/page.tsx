import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import SongCard from "@/components/music/SongCard";
import AdSlot from "@/components/affiliate/AdSlot";

export default async function Genre({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await supabaseServer();
  const { data: g } = await db.from("genres").select("id,name,description").eq("slug", slug).eq("is_active", true).single();
  if (!g) notFound();
  const { data: songs } = await db.from("songs").select("*").eq("genre_id", g.id).eq("status", "published").order("created_at", { ascending: false });
  return (
    <div>
      <h1 className="text-2xl font-bold">{g.name}</h1>
      {g.description && <p className="mb-4 text-mute">{g.description}</p>}
      <AdSlot page="genres" />
      {songs?.length ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{songs.map((s) => <SongCard key={s.id} s={s} />)}</div>
      ) : <p className="mt-4 text-mute">No songs in this genre yet.</p>}
    </div>
  );
}