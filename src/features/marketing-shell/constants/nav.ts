export type MarketingNavId = "home" | "products" | "recipes" | "blog";

export type MarketingNavItem = {
  id: MarketingNavId;
  href: string;
  labelKey: string;
  match: string[];
};

/** Header nav — Contact lives as the CTA button, not a nav link. */
export const MARKETING_NAV: readonly MarketingNavItem[] = [
  {
    id: "home",
    href: "/",
    labelKey: "nav.home",
    match: ["/"],
  },
  {
    id: "products",
    href: "/urunler",
    labelKey: "nav.products",
    match: ["/urunler"],
  },
  {
    id: "recipes",
    href: "/tarifler",
    labelKey: "nav.recipes",
    match: ["/tarifler"],
  },
  {
    id: "blog",
    href: "/blog",
    labelKey: "nav.blog",
    match: ["/blog"],
  },
] as const;

export function getActiveMarketingNavId(pathname: string): MarketingNavId {
  const normalized = pathname.replace(/\/$/, "") || "/";

  if (normalized === "/" || normalized === "") {
    return "home";
  }

  const candidates = MARKETING_NAV.filter((item) => item.id !== "home");
  for (const item of candidates) {
    if (
      item.match.some(
        (prefix) =>
          normalized === prefix || normalized.startsWith(`${prefix}/`),
      )
    ) {
      return item.id;
    }
  }

  return "home";
}
