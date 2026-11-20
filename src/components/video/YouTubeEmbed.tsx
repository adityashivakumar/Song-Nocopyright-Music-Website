"use client";
import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioPlayerContext";
declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void } }
export default function YouTubeEmbed({ videoId }: { videoId: string }) {
  const host = useRef<HTMLDivElement>(null); const { pause } = useAudio();
  useEffect(() => {
    const init = () => new window.YT.Player(host.current, { videoId, host: "https://www.youtube-nocookie.com", playerVars: { rel: 0 },
      events: { onStateChange: (e: any) => { if (e.data === 1) { pause(); window.dispatchEvent(new Event("youtube:start")); } } } });
    if (window.YT?.Player) init(); else { window.onYouTubeIframeAPIReady = init; if (!document.getElementById("yt-api")) { const s = document.createElement("script"); s.id = "yt-api"; s.src = "https://www.youtube.com/iframe_api"; document.body.appendChild(s); } }
  }, [videoId, pause]);
  return <div className="aspect-video w-full overflow-hidden rounded-xl bg-black [&>iframe]:h-full [&>iframe]:w-full"><div ref={host} /></div>;
}
