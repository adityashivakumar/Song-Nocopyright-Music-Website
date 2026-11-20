"use client";
import { Play } from "lucide-react";
import { useAudio, Track } from "@/contexts/AudioPlayerContext";
export default function PlayButton({ track, queue, label = "Play" }: { track: Track; queue?: Track[]; label?: string }) {
  const { play } = useAudio();
  return <button onClick={() => play(track, queue)} className="pill bg-white text-black hover:bg-white/80"><Play size={16} />{label}</button>;
}
