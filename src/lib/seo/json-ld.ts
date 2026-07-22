import { siteConfig } from "@/config/site";
import { getSiteSeoDefaults } from "@/lib/data";

export type OrganizationJsonLd = {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  description: string;
  url: string;
  logo?: string;
};

export async function getOrganizationJsonLd(): Promise<OrganizationJsonLd> {
  let name = "Bonvera";
  let description =
    "Authentic Turkish Cuisine, Crafted in France.";
  let logo: string | undefined;

  try {
    const defaults = await getSiteSeoDefaults();
    if (defaults) {
      name = defaults.organizationNameTr.trim() || name;
      description =
        defaults.organizationDescriptionTr.trim() || description;
      if (defaults.defaultOgImageUrl?.trim()) {
        logo = defaults.defaultOgImageUrl.trim();
      }
    }
  } catch (error) {
    console.warn("[seo] organization json-ld fallback", error);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url: siteConfig.canonicalOrigin,
    ...(logo ? { logo } : {}),
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
