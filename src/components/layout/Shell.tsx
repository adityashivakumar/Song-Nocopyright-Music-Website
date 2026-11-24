import Link from "next/link";
import Footer from "./Footer";
import { Home, Music, Video, Disc3, ListMusic, ShoppingBag, Info, Search } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";

const nav = [
  ["/", "Home", Home],
  ["/music", "Music", Music],
  ["/videos", "Videos", Video],
  ["/genres", "Genres", Disc3],
  ["/playlists", "Playlists", ListMusic],
  ["/recommended-products", "Gear", ShoppingBag],
  ["/about", "About", Info],
] as const;

export default async function Shell({ children }: { children: React.ReactNode }) {
  const db = await supabaseServer();
  const { data } = await db.from("site_settings").select("setting_value").eq("setting_key", "youtube").maybeSingle();
  const handle = data?.setting_value?.handle as string | undefined;
  const sub = handle ? `https://www.youtube.com/@${handle.replace("@", "")}?sub_confirmation=1` : null;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 bg-bg/95 px-3 sm:gap-4 sm:px-4 backdrop-blur">
        <Link href="/" aria-label="No Copyright Music Studio – Home" className="flex shrink-0 items-center">
  <img src="/logo.png" alt="No Copyright Music Studio" className="h-11 w-11 rounded-lg object-cover" />
</Link>
        <form action="/music" className="mx-auto flex w-full max-w-xl">
          <input name="q" placeholder="Search songs" className="w-full rounded-l-full border border-line bg-bg px-4 py-1.5 text-sm outline-none focus:border-link" />
          <button aria-label="Search" className="rounded-r-full border border-l-0 border-line bg-chip px-4"><Search size={18} /></button>
        </form>
        {sub && (
          <a href={sub} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full bg-yt px-3 py-1.5 text-xs font-medium sm:px-4 sm:text-sm">
            Subscribe
          </a>
        )}
      </header>

      <div className="flex">
        <nav className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-20 shrink-0 flex-col gap-1 p-1 md:flex">
          {nav.map(([h, l, I]) => (
            <Link key={h} href={h} className="flex flex-col items-center gap-1 rounded-xl py-3 text-[11px] hover:bg-chip">
              <I size={22} />
              {l}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 flex-1 px-4 pb-40 pt-2">
          {children}
          <Footer />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center gap-1 overflow-x-auto border-t border-line bg-bg px-2 md:hidden">
        {nav.map(([h, l, I]) => (
          <Link key={h} href={h} className="flex min-w-[64px] flex-1 flex-col items-center text-[10px]">
            <I size={20} />
            {l}
          </Link>
        ))}
      </nav>
    </>
  );
}