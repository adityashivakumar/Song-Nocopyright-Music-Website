import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import AdSlot from "@/components/affiliate/AdSlot";

export const metadata = { title: "Genres" };

export default async function Genres() {
  const db = await supabaseServer();
  const { data } = await db.from("genres").select("id,name,slug,description").eq("is_active", true).order("name");
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Genres</h1>
      <AdSlot page="genres" />
      {data?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {data.map((g) => (
            <Link key={g.id} href={`/genres/${g.slug}`} className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-yt/40 to-surface p-3 text-center font-bold transition hover:scale-[1.03]">
              {g.name}
            </Link>
          ))}
        </div>
      ) : <p className="text-mute">No genres yet.</p>}
    </div>
  );
}