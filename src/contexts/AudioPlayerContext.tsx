"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
export type Track = { id: string; title: string; artist: string; src: string; artwork?: string };
type Ctx = { track: Track | null; playing: boolean; time: number; duration: number; volume: number; repeat: boolean; shuffle: boolean; error: string | null;
  play: (t: Track, queue?: Track[]) => void; toggle: () => void; next: () => void; prev: () => void; seek: (s: number) => void; setVolume: (v: number) => void; setRepeat: (b: boolean) => void; setShuffle: (b: boolean) => void; pause: () => void };
const C = createContext<Ctx>(null!);
export const useAudio = () => useContext(C);
export function AudioProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [queue, setQueue] = useState<Track[]>([]); const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false); const [time, setTime] = useState(0); const [duration, setDuration] = useState(0);
  const [volume, setVol] = useState(1); const [repeat, setRepeat] = useState(false); const [shuffle, setShuffle] = useState(false); const [error, setError] = useState<string | null>(null);
  const load = useCallback((t: Track) => { const a = ref.current!; setTrack(t); setError(null); a.src = t.src; a.play().catch(() => setError("Playback failed")); }, []);
  const toggle = () => { const a = ref.current!; if (a.paused) a.play(); else a.pause(); };
  const play = (t: Track, q?: Track[]) => { if (q) setQueue(q); if (track?.id === t.id) return toggle(); load(t); };
  const step = (d: number) => { if (!queue.length || !track) return; const i = queue.findIndex((x) => x.id === track.id); const n = shuffle ? Math.floor(Math.random() * queue.length) : (i + d + queue.length) % queue.length; load(queue[n]); };
  const pause = useCallback(() => ref.current?.pause(), []);
  useEffect(() => { window.addEventListener("youtube:start", pause); return () => window.removeEventListener("youtube:start", pause); }, [pause]);
  useEffect(() => { if (ref.current) ref.current.volume = volume; }, [volume]);
  return (
    <C.Provider value={{ track, playing, time, duration, volume, repeat, shuffle, error, play, toggle, next: () => step(1), prev: () => step(-1), seek: (s) => { if (ref.current) ref.current.currentTime = s; }, setVolume: setVol, setRepeat, setShuffle, pause }}>
      {children}
      <audio ref={ref} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => (repeat ? ref.current!.play() : step(1))} onError={() => setError("This track could not be loaded")} />
    </C.Provider>
  );
}
