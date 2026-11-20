import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { extractVideoId, resolveVideo, slugify } from "@/lib/youtube";
const schema = z.object({ url: z.string().min(11).max(300), title: z.string().trim().max(200).optional(), description: z.string().max(5000).optional(), song_id: z.string().uuid().optional().nullable(), status: z.enum(["draft", "published"]), is_featured: z.boolean().optional() });
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null)); if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const id = extractVideoId(p.data.url); if (!id) return NextResponse.json({ error: "Not a valid YouTube link" }, { status: 400 });
  const meta = await resolveVideo(id); if (!meta) return NextResponse.json({ error: "Video not found or private" }, { status: 404 });
  const title = p.data.title || meta.title;
  const { error } = await supabaseAdmin().from("videos").insert({ title, slug: `${slugify(title) || "video"}-${id.slice(0, 4).toLowerCase()}`, description: p.data.description || null, youtube_url: `https://www.youtube.com/watch?v=${id}`, youtube_video_id: id, thumbnail_url: meta.thumbnail, song_id: p.data.song_id || null, status: p.data.status, is_featured: !!p.data.is_featured, published_at: new Date().toISOString(), source: "manual" });
  if (error) return NextResponse.json({ error: error.code === "23505" ? "This video is already added" : "Database error" }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json({ ok: true, title }, { status: 201 });
}
