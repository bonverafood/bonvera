import { z } from "zod";

export const productStatusSchema = z.enum(["draft", "published", "archived"]);

export const productSlugSchema = z
  .string()
  .trim()
  .min(2, "Slug en az 2 karakter olmali.")
  .max(80, "Slug cok uzun.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug yalnizca kucuk harf, rakam ve tire icerebilir.",
  );

export const productInputSchema = z.object({
  slug: productSlugSchema,
  status: productStatusSchema,
  nameTr: z.string().trim().min(2, "Urun adi gerekli.").max(120),
  summaryTr: z.string().trim().max(400),
  bodyTr: z.string().trim().max(20000),
  imageUrl: z.string().trim().max(500),
  seoTitleTr: z.string().trim().max(120),
  seoDescriptionTr: z.string().trim().max(320),
  ogImageUrl: z.string().trim().max(500),
  sortOrder: z.number().int().min(0).max(9999),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
