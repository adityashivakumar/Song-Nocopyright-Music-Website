import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { presignDownload, headObject } from "@/lib/cloudflare/r2";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = supabaseAdmin();
  const { data: song } = await db.from("songs").select("id,title,artist,audio_key,download_count").eq("id", id).eq("status", "published").single();
  if (!song) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try { await headObject(song.audio_key); } catch { return NextResponse.json({ error: "File missing" }, { status: 410 }); }
  await db.from("downloads").insert({ song_id: song.id });
  await db.from("songs").update({ download_count: song.download_count + 1 }).eq("id", song.id);
  return NextResponse.redirect(await presignDownload(song.audio_key, `${song.artist} - ${song.title}.mp3`));
}
