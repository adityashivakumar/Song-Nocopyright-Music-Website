import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { extractVideoId, resolveVideo } from "@/lib/youtube";
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = z.object({ url: z.string().min(11).max(300) }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const id = extractVideoId(p.data.url);
  if (!id) return NextResponse.json({ error: "Not a YouTube URL" }, { status: 400 });
  const v = await resolveVideo(id);
  if (!v) return NextResponse.json({ error: "Video not found or private" }, { status: 404 });
  return NextResponse.json({ youtube_video_id: id, ...v });
}
