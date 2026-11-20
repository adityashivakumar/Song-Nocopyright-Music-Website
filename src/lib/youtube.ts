export function extractVideoId(input: string): string | null {
  const m = input.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(input) ? input : null;
}
export async function resolveVideo(id: string) {
  const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, { cache: "no-store" });
  if (!r.ok) return null;
  const j = await r.json();
  return { title: j.title as string, author: j.author_name as string, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
}
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
