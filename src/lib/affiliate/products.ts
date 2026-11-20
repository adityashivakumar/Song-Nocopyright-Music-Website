import { supabaseAdmin } from "@/lib/supabase/server";
import { publicUrl } from "@/lib/cloudflare/r2";
import { slugify } from "@/lib/youtube";

export async function toRow(d: Record<string, any>) {
  const db = supabaseAdmin();
  const { category_name, image_key, ...row } = d;
  if (category_name !== undefined) {
    if (category_name) {
      const slug = slugify(category_name);
      const { data } = await db.from("affiliate_categories").upsert({ name: category_name, slug }, { onConflict: "slug" }).select("id").single();
      row.category_id = data?.id ?? null;
    } else row.category_id = null;
  }
  if (image_key) row.image_url = publicUrl(image_key);
  if (row.price !== undefined) row.price_last_verified_at = row.price != null ? new Date().toISOString() : null;
  return row;
}