
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";

const schema = z.object({ enabled: z.boolean(), pages: z.record(z.string(), z.boolean()) });

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { error } = await supabaseAdmin()
    .from("site_settings")
    .upsert({ setting_key: "ads", setting_value: p.data, updated_at: new Date().toISOString() }, { onConflict: "setting_key" });
  return error ? NextResponse.json({ error: "Database error" }, { status: 500 }) : NextResponse.json({ ok: true });
}