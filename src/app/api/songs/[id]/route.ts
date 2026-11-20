import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { r2 } from "@/lib/cloudflare/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = z.object({ status: z.enum(["draft", "published"]).optional(), is_featured: z.boolean().optional() }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { error } = await supabaseAdmin().from("songs").update({ ...p.data, updated_at: new Date().toISOString() }).eq("id", (await params).id);
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
