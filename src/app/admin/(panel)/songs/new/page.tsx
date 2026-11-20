import { supabaseServer } from "@/lib/supabase/server";
import UploadForm from "@/components/admin/UploadForm";
export const dynamic = "force-dynamic";
export default async function New() {
  const db = await supabaseServer(); const { data } = await db.from("genres").select("id,name").order("name");
  return <div><h1 className="mb-3 text-xl font-bold">Upload song</h1><UploadForm genres={data ?? []} /></div>;
}
