import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await supabaseServer();
  const { data: p } = await db.from("affiliate_products").select("*, affiliate_networks(name,slug), affiliate_categories(name)").eq("slug", slug).eq("is_published", true).eq("is_active", true).single();
  if (!p) notFound();
  const net = p.affiliate_networks?.slug;
  const cta = net === "amazon" ? "Check on Amazon" : net === "meesho" ? "View on Meesho" : "View Product";
  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
      {p.image_url ? <img src={p.image_url} alt={p.name} className="aspect-square w-full rounded-xl bg-white object-contain" /> : <div className="aspect-square rounded-xl bg-chip" />}
      <div className="space-y-3">
        <p className="text-xs text-mute">{p.affiliate_categories?.name} · {p.affiliate_networks?.name}</p>
        <h1 className="text-2xl font-bold">{p.name}</h1>
        {p.price && <p className="text-lg">₹{Number(p.price).toLocaleString("en-IN")} <span className="text-xs text-mute">(price may change, check the shop)</span></p>}
        {p.description && <p className="whitespace-pre-line text-sm text-mute">{p.description}</p>}
        <a href={`/api/affiliate/go/${p.id}`} target="_blank" rel="sponsored nofollow noopener" className="pill bg-yt hover:bg-yt/80"><ExternalLink size={16} />{cta}</a>
        <p className="text-xs text-mute">{net === "amazon" ? "As an Amazon Associate I earn from qualifying purchases. " : ""}This is an affiliate link; we may earn a commission at no extra cost to you. <a href="/affiliate-disclosure" className="text-link">Disclosure</a></p>
      </div>
    </div>
  );
}