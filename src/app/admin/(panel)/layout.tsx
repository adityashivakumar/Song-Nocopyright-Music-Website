import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import SignOut from "@/components/admin/SignOut";
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await requireAdmin())) redirect("/admin/login");
  return (<div className="mx-auto max-w-5xl space-y-4">
    <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
      <Link href="/admin/products" className="chip">Products</Link>
<Link href="/admin/products/new" className="chip">Add product</Link>
<Link href="/admin/playlists" className="chip">Playlists</Link>
<Link href="/admin/playlists/new" className="chip">New playlist</Link>
      <Link href="/admin" className="chip">Dashboard</Link><Link href="/admin/songs" className="chip">All songs</Link><Link href="/admin/songs/new" className="chip">Upload song</Link><Link href="/admin/videos/new" className="chip">Add video</Link><Link href="/admin/ads" className="chip">Ad placements</Link><span className="ml-auto"><SignOut /></span></div>
    {children}</div>);
}
