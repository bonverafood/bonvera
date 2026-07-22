import type { MetadataRoute } from "next";

import { routing } from "@/lib/i18n/routing";
import { siteConfig } from "@/config/site";

const PUBLIC_PATHS = [
  "/",
  "/urunler",
  "/tarifler",
  "/blog",
  "/iletisim",
] as const;

/**
 * Public sitemap — marketing URLs only (canonical host: bonvera.food).
 * Studio Admin paths must never appear here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PUBLIC_PATHS) {
    const languages = Object.fromEntries(
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

    entries.push({
      url: siteConfig.canonicalUrl(path),
      lastModified: new Date(),
      alternates: { languages },
    });
  }

  return entries;
}
