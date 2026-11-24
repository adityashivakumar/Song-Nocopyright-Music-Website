import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/youtube";
const schema = z.object({ name: z.string().trim().min(1).max(60), description: z.string().trim().max(300).optional().nullable() });
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Enter a genre name" }, { status: 400 });
  const db = supabaseAdmin(); const base = slugify(p.data.name) || "genre";
  for (const slug of [base, `${base}-${Math.random().toString(36).slice(2, 5)}`]) {
    const { error } = await db.from("genres").insert({ name: p.data.name, slug, description: p.data.description || null });
    if (!error) return NextResponse.json({ ok: true }, { status: 201 });
    if (error.code !== "23505") break;
  }
  return NextResponse.json({ error: "Could not save genre" }, { status: 500 });
}
