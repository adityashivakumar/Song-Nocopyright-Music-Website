import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
export const metadata = { title: "Playlists" };
export default async function Playlists() {
  const db = await supabaseServer();
  const { data } = await db.from("playlists").select("id,title,slug,description").eq("is_published", true).order("created_at", { ascending: false });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Playlists</h1>
      {data?.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((p) => (
            <Link key={p.id} href={`/playlists/${p.slug}`} className="rounded-xl bg-surface p-4 hover:bg-chip">
              <p className="font-bold">{p.title}</p>
              {p.description && <p className="mt-1 line-clamp-2 text-sm text-mute">{p.description}</p>}
            </Link>
          ))}
        </div>
      ) : <p className="text-mute">No playlists yet.</p>}
    </div>
  );
}