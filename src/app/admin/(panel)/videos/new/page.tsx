import { supabaseServer } from "@/lib/supabase/server";
import VideoForm from "@/components/admin/VideoForm";
export const dynamic = "force-dynamic";
export default async function NewVideo() {
  const db = await supabaseServer(); const { data } = await db.from("songs").select("id,title").order("title");
  return <div><h1 className="mb-3 text-xl font-bold">Add video</h1><VideoForm songs={data ?? []} /></div>;
}
