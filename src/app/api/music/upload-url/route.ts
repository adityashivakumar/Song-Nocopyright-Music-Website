import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { presignUpload } from "@/lib/cloudflare/r2";
const schema = z.object({ kind: z.enum(["audio", "artwork"]), contentType: z.string(), size: z.number().max(100 * 1024 * 1024) });
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { kind, contentType } = p.data;
  if (kind === "audio" && contentType !== "audio/mpeg") return NextResponse.json({ error: "MP3 only" }, { status: 400 });
  if (kind === "artwork" && !["image/webp", "image/jpeg", "image/png"].includes(contentType)) return NextResponse.json({ error: "Bad image type" }, { status: 400 });
  const key = kind === "audio" ? `songs/${randomUUID()}.mp3` : `artwork/${randomUUID()}.${contentType.split("/")[1]}`;
  return NextResponse.json({ key, url: await presignUpload(key, contentType) });
}
