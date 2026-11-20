import { supabaseServer } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const db = await supabaseServer();
  const [{ data: networks }, { data: cats }] = await Promise.all([db.from("affiliate_networks").select("id,name").order("name"), db.from("affiliate_categories").select("name").order("name")]);
  return <div><h1 className="mb-3 text-xl font-bold">Add product</h1><ProductForm networks={networks ?? []} categories={(cats ?? []).map((c) => c.name)} /></div>;
}