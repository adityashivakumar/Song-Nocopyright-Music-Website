import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import SongEditForm from "@/components/admin/SongEditForm";
export const dynamic = "force-dynamic";
export default async function EditSong({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const db = await supabaseServer();
  const [{ data: song }, { data: genres }] = await Promise.all([db.from("songs").select("*").eq("id", id).single(), db.from("genres").select("id,name").order("name")]);
  if (!song) notFound();
  return <div><h1 className="mb-3 text-xl font-bold">Edit song</h1><SongEditForm song={song} genres={genres ?? []} /></div>;
}
