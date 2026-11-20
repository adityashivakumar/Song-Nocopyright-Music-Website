import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/youtube";
export async function POST() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const { data: s } = await db.from("site_settings").select("setting_value").eq("setting_key", "youtube").single();
  const channelId = s?.setting_value?.channel_id;
  if (!channelId) return NextResponse.json({ error: "Set the channel ID in Channel Settings first" }, { status: 400 });
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Could not read channel feed" }, { status: 502 });
  const xml = await res.text();
  const rows = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
    const id = e.match(/<yt:videoId>([\w-]{11})/)?.[1] ?? "";
    const title = (e.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    return { youtube_video_id: id, youtube_url: `https://www.youtube.com/watch?v=${id}`, title, slug: `${slugify(title)}-${id.slice(0, 4).toLowerCase()}`, thumbnail_url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, published_at: e.match(/<published>(.*?)<\/published>/)?.[1], status: "draft", source: "channel_sync" };
  }).filter((r) => r.youtube_video_id);
  const { error } = await db.from("videos").upsert(rows, { onConflict: "youtube_video_id", ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
  return NextResponse.json({ checked: rows.length });
}
