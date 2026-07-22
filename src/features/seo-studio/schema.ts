import { z } from "zod";

import { SITE_SEO_PAGE_KEYS } from "@/lib/data";

export const siteSeoDefaultsSchema = z.object({
  titleSuffixTr: z.string().trim().max(40),
  defaultDescriptionTr: z.string().trim().max(320),
  defaultOgImageUrl: z.string().trim().max(500),
  organizationNameTr: z
    .string()
    .trim()
    .min(2, "Organizasyon adi gerekli.")
    .max(120),
  organizationDescriptionTr: z.string().trim().max(320),
});

export type SiteSeoDefaultsInput = z.infer<typeof siteSeoDefaultsSchema>;

export const siteSeoPageKeySchema = z.enum(SITE_SEO_PAGE_KEYS);

export const siteSeoPageSchema = z.object({
  pageKey: siteSeoPageKeySchema,
  titleTr: z.string().trim().max(120),
  descriptionTr: z.string().trim().max(320),
  ogImageUrl: z.string().trim().max(500),
});

export type SiteSeoPageInput = z.infer<typeof siteSeoPageSchema>;

export function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
