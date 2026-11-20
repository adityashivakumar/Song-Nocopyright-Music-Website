import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { headObject } from "@/lib/cloudflare/r2";
import { extractVideoId, slugify } from "@/lib/youtube";
const opt = z.string().trim().max(2000).optional().nullable().transform((v) => v || null);
const schema = z.object({ title: z.string().trim().min(1).max(200), artist: z.string().trim().min(1).max(200), description: opt, genre_id: z.string().uuid().optional().nullable(), mood: opt, language: opt, youtube_url: opt, usage_rights: opt, attribution_text: opt,
  status: z.enum(["draft", "published"]), is_featured: z.boolean(), audio_key: z.string().regex(/^songs\/[0-9a-f-]{36}\.mp3$/), artwork_key: z.string().regex(/^artwork\/[0-9a-f-]{36}\.(webp|jpeg|png)$/).optional(), duration: z.number().catch(0), file_size: z.number().catch(0) });
export async function POST(req: Request) {
  const user = await requireAdmin(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null)); if (!p.success) return NextResponse.json({ error: "Invalid: " + p.error.issues.map((i) => i.path.join(".")).join(", ") }, { status: 400 });
  const d = p.data;
  try { await headObject(d.audio_key); } catch { return NextResponse.json({ error: "MP3 not found in storage. Upload again." }, { status: 400 }); }
  const { youtube_url, ...rest } = d;
  const row = { ...rest, slug: `${slugify(d.title) || "song"}-${Math.random().toString(36).slice(2, 6)}`, youtube_video_id: youtube_url ? extractVideoId(youtube_url) : null };
  const db = supabaseAdmin(); const { data, error } = await db.from("songs").insert(row).select("id,slug").single();
  if (error) return NextResponse.json({ error: "Database error while saving" }, { status: 500 });
  await db.from("audit_logs").insert({ admin_user_id: user.id, action: "song.create", entity_type: "song", entity_id: data.id });
  return NextResponse.json(data, { status: 201 });
}
