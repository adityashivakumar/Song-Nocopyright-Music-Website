import { supabaseServer } from "@/lib/supabase/server";
import SongActions from "@/components/admin/SongActions";
export const dynamic = "force-dynamic";
export default async function Songs() {
  const db = await supabaseServer(); const { data } = await db.from("songs").select("id,title,artist,status,play_count,download_count").order("created_at", { ascending: false });
  return (<div className="space-y-2"><h1 className="text-xl font-bold">All songs</h1>
    {data?.length ? data.map((s) => <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-surface p-3"><div className="min-w-0 flex-1"><p className="truncate font-medium">{s.title}</p><p className="text-xs text-mute">{s.artist} · {s.status} · {s.play_count} plays · {s.download_count} downloads</p></div><SongActions id={s.id} status={s.status} /></div>) : <p className="text-mute">No songs yet. Use “Upload song”.</p>}</div>);
}
