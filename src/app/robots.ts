import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Marketing robots.txt.
 * Admin host short-circuits in middleware with Disallow: / and X-Robots-Tag.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: siteConfig.canonicalUrl("/sitemap.xml"),
    host: siteConfig.canonicalOrigin,
  };
}
