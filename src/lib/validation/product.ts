import { z } from "zod";

const text = (n: number) => z.string().trim().max(n).optional().nullable().transform((v) => v || null);
const https = (u: string) => /^https:\/\//i.test(u);

export const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  network_id: z.string().uuid(),
  affiliate_url: z.string().trim().url().max(2000).refine(https, "Link must start with https://"),
  original_url: text(2000),
  description: text(3000),
  brand: text(100),
  category_name: text(100),
  price: z.number().min(0).nullable().optional(),
  currency: z.string().trim().max(5).optional(),
  image_url: z.string().trim().url().max(2000).refine(https, "Image must be https").optional().nullable(),
  image_key: z.string().regex(/^artwork\/[0-9a-f-]{36}\.(webp|jpeg|png)$/).optional(),
  image_source: text(200),
  image_permission: text(200),
  display_order: z.number().int().optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
  ad_placement: z.enum(["banner", "side", "strip"]).nullable().optional(),
  ad_pages: z.array(z.enum(["music", "song", "videos", "video", "genres", "playlists"])).optional(),
});

export const productPatchSchema = productSchema.partial();