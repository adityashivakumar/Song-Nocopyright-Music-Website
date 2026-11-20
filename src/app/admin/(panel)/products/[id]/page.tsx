import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await supabaseServer();
  const [{ data: p }, { data: networks }, { data: cats }] = await Promise.all([
    db.from("affiliate_products").select("*, affiliate_categories(name)").eq("id", id).single(),
    db.from("affiliate_networks").select("id,name").order("name"),
    db.from("affiliate_categories").select("name").order("name"),
  ]);
  if (!p) notFound();
  return <div><h1 className="mb-3 text-xl font-bold">Edit product</h1><ProductForm networks={networks ?? []} categories={(cats ?? []).map((c) => c.name)} product={{ ...p, category_name: p.affiliate_categories?.name ?? "" }} /></div>;
}