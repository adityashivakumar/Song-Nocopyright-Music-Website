import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import YouTubeEmbed from "@/components/video/YouTubeEmbed";
import AdSlot from "@/components/affiliate/AdSlot";

export default async function Video({ params }: { params: Promise<{ slug: string }> }) {
  const db = await supabaseServer();
  const { data: v } = await db
    .from("videos")
    .select("*, songs(slug,title)")
    .eq("slug", (await params).slug)
    .eq("status", "published")
    .single();
  if (!v) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <YouTubeEmbed videoId={v.youtube_video_id} />
      <h1 className="text-xl font-bold">{v.title}</h1>
      {v.songs && (
        <Link href={`/music/${v.songs.slug}`} className="pill">
          Play / download the MP3: {v.songs.title}
        </Link>
      )}

      <AdSlot page="video" layout="strip" />

      {v.description && <p className="whitespace-pre-line rounded-xl bg-surface p-4 text-sm">{v.description}</p>}
    </div>
  );
}