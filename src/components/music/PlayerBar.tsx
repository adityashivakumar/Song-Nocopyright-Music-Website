"use client";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2 } from "lucide-react";
import { useAudio } from "@/contexts/AudioPlayerContext";
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
export default function PlayerBar() {
  const a = useAudio(); if (!a.track) return null;
  return (
    <div className="fixed bottom-14 inset-x-0 z-50 border-t border-line bg-surface/95 backdrop-blur md:bottom-0">
      <input type="range" aria-label="Seek" min={0} max={a.duration || 0} step={1} value={a.time} onChange={(e) => a.seek(+e.target.value)} className="block h-1 w-full accent-yt" />
      <div className="flex items-center gap-3 px-4 py-2">
        {a.track.artwork && <img src={a.track.artwork} alt="" className="h-12 w-12 rounded-lg object-cover" />}
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{a.track.title}</p><p className="truncate text-xs text-mute">{a.error ?? a.track.artist}</p></div>
        <span className="hidden text-xs text-mute sm:block">{fmt(a.time)} / {fmt(a.duration || 0)}</span>
        <button aria-label="Shuffle" onClick={() => a.setShuffle(!a.shuffle)} className={"hidden sm:block " + (a.shuffle ? "text-yt" : "text-mute")}><Shuffle size={18} /></button>
        <button aria-label="Previous" onClick={a.prev}><SkipBack size={20} /></button>
        <button aria-label="Play or pause" onClick={a.toggle} className="rounded-full bg-white p-2 text-black">{a.playing ? <Pause size={20} /> : <Play size={20} />}</button>
        <button aria-label="Next" onClick={a.next}><SkipForward size={20} /></button>
        <button aria-label="Repeat" onClick={() => a.setRepeat(!a.repeat)} className={"hidden sm:block " + (a.repeat ? "text-yt" : "text-mute")}><Repeat size={18} /></button>
        <Volume2 size={18} className="hidden text-mute sm:block" />
        <input type="range" aria-label="Volume" min={0} max={1} step={0.05} value={a.volume} onChange={(e) => a.setVolume(+e.target.value)} className="hidden w-20 accent-yt sm:block" />
      </div>
    </div>
  );
}
