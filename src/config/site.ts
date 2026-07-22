import { bonvera } from "@/config/brands";
import {
  buildCanonicalUrl,
  getAdminUrl,
  getCanonicalOrigin,
  getMarketingUrl,
} from "@/lib/hosts";

/**
 * Site-level configuration for Bonvera Studio.
 * Canonical / SEO URLs always use the marketing origin (bonvera.food).
 */
export const siteConfig = {
  name: "Bonvera Studio",
  description: "Bonvera için premium dahili işletim sistemi",
  brandName: bonvera.name,
  /** @deprecated Prefer brandName */
  primaryBrandName: bonvera.name,
  get marketingUrl() {
    return getMarketingUrl();
  },
  get adminUrl() {
    return getAdminUrl();
  },
  get canonicalOrigin() {
    return getCanonicalOrigin();
  },
  canonicalUrl(pathname = "/") {
    return buildCanonicalUrl(pathname);
  },
} as const;
