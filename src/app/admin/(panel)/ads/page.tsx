
import { supabaseServer } from "@/lib/supabase/server";
import { getAdSettings } from "@/lib/ads";
import AdSettingsForm from "@/components/admin/AdSettingsForm";
export const dynamic = "force-dynamic";

export default async function AdsPage() {
  const db = await supabaseServer();
  const settings = await getAdSettings(db);
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Ad placements</h1>
      <p className="text-sm text-mute">Choose which pages show affiliate ads. Each product also needs the page ticked in its own form (Products → Edit → “Also show this ad on”).</p>
      <AdSettingsForm initial={settings} />
    </div>
  );
}