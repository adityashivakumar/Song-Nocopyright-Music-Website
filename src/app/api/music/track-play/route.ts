import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const p = z.object({ id: z.string().uuid() }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const db = supabaseAdmin();
  const { data: s } = await db.from("songs").select("play_count").eq("id", p.data.id).eq("status", "published").single();
  if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.from("songs").update({ play_count: (s.play_count ?? 0) + 1 }).eq("id", p.data.id);
  return NextResponse.json({ ok: true });
}
