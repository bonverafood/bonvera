import type { MetadataRoute } from "next";

import { routing } from "@/lib/i18n/routing";
import { siteConfig } from "@/config/site";
import { listPublishedProducts } from "@/lib/data";

const PUBLIC_PATHS = [
  "/",
  "/urunler",
  "/tarifler",
  "/blog",
  "/iletisim",
] as const;

function languageAlternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => {
      const localized =
        locale === routing.defaultLocale
          ? path
          : path === "/"
            ? `/${locale}`
            : `/${locale}${path}`;
      return [locale, siteConfig.canonicalUrl(localized)];
    }),
  );
}

/**
 * Public sitemap — marketing URLs only (canonical host: bonvera.food).
 * Studio Admin paths must never appear here.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PUBLIC_PATHS) {
    entries.push({
      url: siteConfig.canonicalUrl(path),
      lastModified: new Date(),
      alternates: { languages: languageAlternates(path) },
    });
  }

  try {
    const products = await listPublishedProducts();
    for (const product of products) {
      const path = `/urunler/${product.slug}`;
      entries.push({
        url: siteConfig.canonicalUrl(path),
        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : new Date(),
        alternates: { languages: languageAlternates(path) },
      });
    }
  } catch (error) {
    console.warn("[sitemap] published products unavailable", error);
  }

  return entries;
}
