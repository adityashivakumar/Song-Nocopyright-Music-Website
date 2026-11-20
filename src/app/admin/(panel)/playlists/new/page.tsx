import { supabaseServer } from "@/lib/supabase/server";
import PlaylistForm from "@/components/admin/PlaylistForm";
export const dynamic = "force-dynamic";

export default async function NewPlaylist() {
  const db = await supabaseServer();
  const { data: songs } = await db.from("songs").select("id,title,artist").order("title");
  return <div><h1 className="mb-3 text-xl font-bold">New playlist</h1><PlaylistForm songs={songs ?? []} /></div>;
}