import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import SignOut from "@/components/admin/SignOut";

const links = [["/admin", "Dashboard"], ["/admin/songs/new", "Upload song"], ["/admin/songs", "Songs"], ["/admin/genres", "Genres"], ["/admin/videos", "Videos"], ["/admin/videos/new", "Add video"], ["/admin/playlists", "Playlists"], ["/admin/products", "Products"], ["/admin/ads", "Ads"]];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await requireAdmin())) redirect("/admin/login");
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          {links.map(([h, l]) => <Link key={h} href={h} className="chip">{l}</Link>)}
        </div>
        <SignOut />
      </div>
      {children}
    </div>
  );
}
