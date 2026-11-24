import "./globals.css";
import type { Viewport } from "next";
import { Roboto } from "next/font/google";
import { AudioProvider } from "@/contexts/AudioPlayerContext";
import PlayerBar from "@/components/music/PlayerBar";
import Shell from "@/components/layout/Shell";
import { SITE_URL } from "@/lib/site";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto" });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "SONG – No Copyright Music", template: "%s | SONG – No Copyright Music" },
  description: "Discover, stream and download no copyright music.",
  openGraph: { title: "SONG – No Copyright Music", description: "Discover, stream and download no copyright music.", type: "website" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0F0F0F" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="font-sans"><AudioProvider><Shell>{children}</Shell><PlayerBar /></AudioProvider></body>
    </html>
  );
}
