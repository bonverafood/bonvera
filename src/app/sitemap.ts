import type { MetadataRoute } from "next";

import { routing } from "@/lib/i18n/routing";
import { siteConfig } from "@/config/site";

/**
 * Public sitemap — marketing URLs only (canonical host: bonvera.food).
 * Studio Admin paths must never appear here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      locale === routing.defaultLocale
        ? siteConfig.canonicalUrl("/")
        : siteConfig.canonicalUrl(`/${locale}`),
    ]),
  );

  return [
    {
      url: siteConfig.canonicalUrl("/"),
      lastModified: new Date(),
      alternates: { languages },
    },
  ];
}
