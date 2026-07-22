import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import {
  getSiteSeoDefaults,
  getSiteSeoPageByKey,
  type SiteSeoPageKey,
} from "@/lib/data";

export type PageMetaFallback = {
  title: string;
  description: string;
};

export type ResolvedPageMetadata = {
  title: string;
  description: string;
  canonicalPath: string;
  ogImageUrl: string | null;
};

/**
 * Resolve marketing page metadata from SEO Studio tables,
 * falling back to i18n (or other) strings when DB fields are empty / unavailable.
 */
export async function resolvePageMetadata(
  pageKey: SiteSeoPageKey,
  fallback: PageMetaFallback,
): Promise<ResolvedPageMetadata> {
  const pathByKey: Record<SiteSeoPageKey, string> = {
    home: "/",
    urunler: "/urunler",
    tarifler: "/tarifler",
    blog: "/blog",
    iletisim: "/iletisim",
  };

  let title = fallback.title;
  let description = fallback.description;
  let ogImageUrl: string | null = null;
  const canonicalPath = pathByKey[pageKey];

  try {
    const [defaults, page] = await Promise.all([
      getSiteSeoDefaults(),
      getSiteSeoPageByKey(pageKey),
    ]);

    if (page?.titleTr?.trim()) {
      title = page.titleTr.trim();
    } else if (defaults?.titleSuffixTr && !title.includes("Bonvera")) {
      title = `${title}${defaults.titleSuffixTr}`;
    }

    if (page?.descriptionTr?.trim()) {
      description = page.descriptionTr.trim();
    } else if (defaults?.defaultDescriptionTr?.trim()) {
      description = defaults.defaultDescriptionTr.trim();
    }

    ogImageUrl =
      page?.ogImageUrl?.trim() ||
      defaults?.defaultOgImageUrl?.trim() ||
      null;
  } catch (error) {
    console.warn("[seo] resolvePageMetadata fallback", pageKey, error);
  }

  return { title, description, canonicalPath, ogImageUrl };
}

export function toNextMetadata(
  resolved: ResolvedPageMetadata,
): Metadata {
  const canonical = siteConfig.canonicalUrl(resolved.canonicalPath);
  const images = resolved.ogImageUrl
    ? [{ url: resolved.ogImageUrl }]
    : undefined;

  return {
    title: resolved.title,
    description: resolved.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolved.title,
      description: resolved.description,
      url: canonical,
      siteName: "Bonvera",
      type: "website",
      images,
    },
    twitter: {
      card: resolved.ogImageUrl ? "summary_large_image" : "summary",
      title: resolved.title,
      description: resolved.description,
      images: resolved.ogImageUrl ? [resolved.ogImageUrl] : undefined,
    },
  };
}

export async function buildPageMetadata(
  pageKey: SiteSeoPageKey,
  fallback: PageMetaFallback,
): Promise<Metadata> {
  const resolved = await resolvePageMetadata(pageKey, fallback);
  return toNextMetadata(resolved);
}
