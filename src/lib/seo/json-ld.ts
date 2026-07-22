import { siteConfig } from "@/config/site";

export type OrganizationJsonLd = {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  description: string;
  url: string;
  logo?: string;
};

/**
 * Organization JSON-LD for the public site.
 * Uses static Bonvera defaults — avoids service-role DB calls in the marketing layout.
 * SEO Studio site defaults still drive meta tags via generateMetadata.
 */
export function getOrganizationJsonLd(): OrganizationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bonvera",
    description: "Authentic Turkish Cuisine, Crafted in France.",
    url: siteConfig.canonicalOrigin,
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
