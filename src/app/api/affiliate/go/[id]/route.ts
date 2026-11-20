import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = supabaseAdmin();
  const { data: p } = await db.from("affiliate_products").select("id,network_id,affiliate_url").eq("id", id).eq("is_published", true).eq("is_active", true).single();
  if (!p || !/^https:\/\//.test(p.affiliate_url)) return NextResponse.redirect(new URL("/recommended-products", req.url));
  const ua = req.headers.get("user-agent") ?? "";
  if (!/bot|crawl|spider/i.test(ua))
    await db.from("affiliate_clicks").insert({ product_id: p.id, network_id: p.network_id, referrer: req.headers.get("referer"), device_type: /mobile/i.test(ua) ? "mobile" : "desktop" });
  return NextResponse.redirect(p.affiliate_url, 302);
}
