import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = z.object({ is_active: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { error } = await supabaseAdmin().from("genres").update(p.data).eq("id", (await params).id);
  return error ? NextResponse.json({ error: "Database error" }, { status: 500 }) : NextResponse.json({ ok: true });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { error } = await supabaseAdmin().from("genres").delete().eq("id", (await params).id);
  return error ? NextResponse.json({ error: "Database error" }, { status: 500 }) : NextResponse.json({ ok: true });
}
