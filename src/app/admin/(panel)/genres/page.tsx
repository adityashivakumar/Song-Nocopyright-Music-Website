import { supabaseServer } from "@/lib/supabase/server";
import GenreManager from "@/components/admin/GenreManager";
export const dynamic = "force-dynamic";
export default async function Genres() {
  const db = await supabaseServer(); const { data } = await db.from("genres").select("id,name,is_active").order("name");
  return <div className="space-y-3"><h1 className="text-xl font-bold">Genres</h1><GenreManager genres={data ?? []} /></div>;
}
