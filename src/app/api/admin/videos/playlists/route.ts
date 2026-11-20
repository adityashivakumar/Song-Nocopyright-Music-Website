import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/youtube";

export const playlistSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().max(1000).optional().nullable(),
  is_published: z.boolean(),
  is_featured: z.boolean().optional(),
  song_ids: z.array(z.string().uuid()).max(500),
});

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = playlistSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid: " + p.error.issues.map((i) => i.path.join(".")).join(", ") }, { status: 400 });
  const { song_ids, ...rest } = p.data;
  const db = supabaseAdmin();
  const { data, error } = await db.from("playlists").insert({ ...rest, description: rest.description || null, slug: `${slugify(rest.title) || "playlist"}-${Math.random().toString(36).slice(2, 6)}` }).select("id").single();
  if (error) return NextResponse.json({ error: "Database error while saving" }, { status: 500 });
  if (song_ids.length) {
    const { error: e2 } = await db.from("playlist_songs").insert(song_ids.map((song_id, i) => ({ playlist_id: data.id, song_id, position: i + 1 })));
    if (e2) { await db.from("playlists").delete().eq("id", data.id); return NextResponse.json({ error: "Could not save songs" }, { status: 500 }); }
  }
  return NextResponse.json(data, { status: 201 });
}