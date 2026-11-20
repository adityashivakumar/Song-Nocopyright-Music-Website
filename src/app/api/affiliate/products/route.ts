import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validation/product";
import { toRow } from "@/lib/affiliate/products";
import { slugify } from "@/lib/youtube";

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = productSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid: " + p.error.issues.map((i) => `${i.path.join(".")} (${i.message})`).join(", ") }, { status: 400 });
  const row = await toRow(p.data);
  const { data, error } = await supabaseAdmin().from("affiliate_products")
    .insert({ ...row, slug: `${slugify(p.data.name) || "product"}-${Math.random().toString(36).slice(2, 6)}`, is_published: p.data.is_published ?? false, is_active: p.data.is_active ?? true, is_featured: p.data.is_featured ?? false })
    .select("id").single();
  if (error) return NextResponse.json({ error: "Database error while saving" }, { status: 500 });
  await supabaseAdmin().from("audit_logs").insert({ admin_user_id: user.id, action: "product.create", entity_type: "product", entity_id: data.id });
  return NextResponse.json(data, { status: 201 });
}