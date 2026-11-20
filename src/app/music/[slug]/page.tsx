import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { publicUrl } from "@/lib/cloudflare/r2";
import PlayButton from "@/components/music/PlayButton";
import YouTubeEmbed from "@/components/video/YouTubeEmbed";
import AdSlot from "@/components/affiliate/AdSlot";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const db = await supabaseServer();
  const { data: s } = await db.from("songs").select("title,artist,seo_title,seo_description,description").eq("slug", (await params).slug).single();
  return s ? { title: s.seo_title ?? `${s.title} – ${s.artist}`, description: s.seo_description ?? s.description ?? undefined } : {};
}

export default async function Song({ params }: { params: Promise<{ slug: string }> }) {
  const db = await supabaseServer();
  const { data: s } = await db.from("songs").select("*").eq("slug", (await params).slug).single();
  if (!s) notFound();
  const track = { id: s.id, title: s.title, artist: s.artist, src: publicUrl(s.audio_key), artwork: publicUrl(s.artwork_key) };
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {s.youtube_video_id ? <YouTubeEmbed videoId={s.youtube_video_id} /> : s.artwork_key && <img src={track.artwork} alt="" className="aspect-video w-full rounded-xl object-cover" />}
      <h1 className="text-xl font-bold">{s.title}</h1>
      <p className="text-mute">{s.artist}{s.mood ? ` · ${s.mood}` : ""}</p>
      <div className="flex flex-wrap gap-2">
        <PlayButton track={track} label="Play MP3" />
        <a href={`/api/music/download/${s.id}`} className="pill"><Download size={16} />Download MP3</a>
      </div>

      <AdSlot page="song" layout="strip" />

      {s.description && <p className="whitespace-pre-line rounded-xl bg-surface p-4 text-sm">{s.description}</p>}
      {(s.usage_rights || s.attribution_text) && (
        <div className="rounded-xl bg-surface p-4 text-sm">
          <h2 className="font-medium">Usage &amp; attribution</h2>
          <p className="text-mute">{s.usage_rights}</p>
          <p className="text-mute">{s.attribution_text}</p>
        </div>
      )}
    </div>
  );
}