import { NextResponse } from "next/server";
import { z } from "zod";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { r2 } from "@/lib/cloudflare/r2";
import { extractVideoId } from "@/lib/youtube";
const opt = z.string().trim().max(2000).nullable().optional();
const schema = z.object({
  title: z.string().trim().min(1).max(200).optional(), artist: z.string().trim().min(1).max(200).optional(),
  description: opt, mood: opt, language: opt, usage_rights: opt, attribution_text: opt, youtube_url: opt,
  genre_id: z.string().uuid().nullable().optional(), status: z.enum(["draft", "published"]).optional(), is_featured: z.boolean().optional(),
});
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid: " + p.error.issues.map((i) => i.path.join(".")).join(", ") }, { status: 400 });
  const { youtube_url, ...rest } = p.data;
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(rest)) if (v !== undefined) update[k] = v === "" ? null : v;
  if (youtube_url !== undefined) {
    const id = youtube_url ? extractVideoId(youtube_url) : null;
    if (youtube_url && !id) return NextResponse.json({ error: "Not a valid YouTube link" }, { status: 400 });
    update.youtube_video_id = id;
  }
  const { error } = await supabaseAdmin().from("songs").update(update).eq("id", (await params).id);
  return error ? NextResponse.json({ error: "Database error" }, { status: 500 }) : NextResponse.json({ ok: true });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin(); const id = (await params).id;
  const { data: s } = await db.from("songs").select("audio_key,artwork_key").eq("id", id).single();
  const { error } = await db.from("songs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
  for (const Key of [s?.audio_key, s?.artwork_key]) if (Key) await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME!, Key })).catch(() => {});
  return NextResponse.json({ ok: true });
}
