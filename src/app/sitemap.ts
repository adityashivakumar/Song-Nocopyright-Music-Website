import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/music", "/videos", "/genres", "/playlists", "/recommended-products", "/about", "/contact", "/privacy-policy", "/terms", "/affiliate-disclosure", "/copyright-policy"].map((p) => ({ url: `${SITE_URL}${p}` }));
  try {
    const db = supabaseAdmin();
    const [s, v, g, p] = await Promise.all([
      db.from("songs").select("slug,updated_at").eq("status", "published"),
      db.from("videos").select("slug,updated_at").eq("status", "published"),
      db.from("genres").select("slug").eq("is_active", true),
      db.from("playlists").select("slug").eq("is_published", true),
    ]);
    return [
      ...pages,
      ...(s.data ?? []).map((x: any) => ({ url: `${SITE_URL}/music/${x.slug}`, lastModified: x.updated_at })),
      ...(v.data ?? []).map((x: any) => ({ url: `${SITE_URL}/videos/${x.slug}`, lastModified: x.updated_at })),
      ...(g.data ?? []).map((x: any) => ({ url: `${SITE_URL}/genres/${x.slug}` })),
      ...(p.data ?? []).map((x: any) => ({ url: `${SITE_URL}/playlists/${x.slug}` })),
    ];
  } catch { return pages; }
}
