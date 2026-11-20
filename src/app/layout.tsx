import "./globals.css";
import { Roboto } from "next/font/google";
import { AudioProvider } from "@/contexts/AudioPlayerContext";
import PlayerBar from "@/components/music/PlayerBar";
import Shell from "@/components/layout/Shell";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto" });
export const metadata = { title: "SONG – No Copyright Music", description: "Discover, stream and download music." };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={roboto.variable}><body className="font-sans"><AudioProvider><Shell>{children}</Shell><PlayerBar /></AudioProvider></body></html>;
}
