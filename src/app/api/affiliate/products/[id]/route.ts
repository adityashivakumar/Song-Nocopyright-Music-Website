import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { productPatchSchema } from "@/lib/validation/product";
import { toRow } from "@/lib/affiliate/products";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = productPatchSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid: " + p.error.issues.map((i) => `${i.path.join(".")} (${i.message})`).join(", ") }, { status: 400 });
  const row = await toRow(p.data);
  const { error } = await supabaseAdmin().from("affiliate_products").update({ ...row, updated_at: new Date().toISOString() }).eq("id", (await params).id);
  return error ? NextResponse.json({ error: "Database error" }, { status: 500 }) : NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { error } = await supabaseAdmin().from("affiliate_products").delete().eq("id", (await params).id);
  return error ? NextResponse.json({ error: "Database error" }, { status: 500 }) : NextResponse.json({ ok: true });
}