
export const AD_PAGES = [
  ["home", "Home page"],
  ["music", "Music page"],
  ["song", "Song / download page"],
  ["videos", "Videos page"],
  ["video", "Video watch page"],
  ["genres", "Genre pages"],
  ["playlists", "Playlist pages"],
] as const;

export type AdSettings = { enabled: boolean; pages: Record<string, boolean> };

export async function getAdSettings(db: any): Promise<AdSettings> {
  const { data } = await db.from("site_settings").select("setting_value").eq("setting_key", "ads").maybeSingle();
  const v = data?.setting_value ?? {};
  return { enabled: v.enabled !== false, pages: v.pages ?? {} };
}

export async function adEnabled(db: any, page: string) {
  const s = await getAdSettings(db);
  return s.enabled && s.pages[page] !== false;
}