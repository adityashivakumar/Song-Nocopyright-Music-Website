import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";

const patchSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().max(1000).optional().nullable(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  song_ids: z.array(z.string().uuid()).max(500).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = patchSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const id = (await params).id;
  const { song_ids, ...rest } = p.data;
  const db = supabaseAdmin();
  if (Object.keys(rest).length) {
    const { error } = await db.from("playlists").update({ ...rest, ...(rest.description !== undefined ? { description: rest.description || null } : {}) }).eq("id", id);
    if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
  if (song_ids) {
    await db.from("playlist_songs").delete().eq("playlist_id", id);
    if (song_ids.length) {
      const { error } = await db.from("playlist_songs").insert(song_ids.map((song_id, i) => ({ playlist_id: id, song_id, position: i + 1 })));
      if (error) return NextResponse.json({ error: "Could not save songs" }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { error } = await supabaseAdmin().from("playlists").delete().eq("id", (await params).id);
  return error ? NextResponse.json({ error: "Database error" }, { status: 500 }) : NextResponse.json({ ok: true });
}