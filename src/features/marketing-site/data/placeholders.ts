export type MarketingProduct = {
  slug: string;
  nameKey: string;
  summaryKey: string;
  image: string;
  categoryKey: string;
};

export type MarketingRecipe = {
  slug: string;
  titleKey: string;
  summaryKey: string;
};

export type MarketingPost = {
  slug: string;
  titleKey: string;
  summaryKey: string;
};

/** Shell placeholders — no CMS/DB yet (Sprint 5). */
export const MARKETING_PRODUCTS: readonly MarketingProduct[] = [
  {
    slug: "icli-kofte",
    nameKey: "products.items.icliKofte.name",
    summaryKey: "products.items.icliKofte.summary",
    image: "/brand/product-icli-kofte.jpg",
    categoryKey: "products.categories.core",
  },
  {
    slug: "yaprak-sarmasi",
    nameKey: "products.items.yaprakSarmasi.name",
    summaryKey: "products.items.yaprakSarmasi.summary",
    image: "/brand/hero.jpg",
    categoryKey: "products.categories.core",
  },
  {
    slug: "ezme",
    nameKey: "products.items.ezme.name",
    summaryKey: "products.items.ezme.summary",
    image: "/brand/product-icli-kofte.jpg",
    categoryKey: "products.categories.meze",
  },
] as const;

export const MARKETING_RECIPES: readonly MarketingRecipe[] = [
  {
    slug: "mezeli-tabak",
    titleKey: "recipes.items.mezeliTabak.title",
    summaryKey: "recipes.items.mezeliTabak.summary",
  },
  {
    slug: "icli-kofte-servisi",
    titleKey: "recipes.items.icliServis.title",
    summaryKey: "recipes.items.icliServis.summary",
  },
] as const;

export const MARKETING_POSTS: readonly MarketingPost[] = [
  {
    slug: "strasbourg-turk-mutfagi",
    titleKey: "blog.items.strasbourg.title",
    summaryKey: "blog.items.strasbourg.summary",
  },
  {
    slug: "meze-kulturu",
    titleKey: "blog.items.meze.title",
    summaryKey: "blog.items.meze.summary",
  },
] as const;

export function getMarketingProduct(slug: string) {
  return MARKETING_PRODUCTS.find((p) => p.slug === slug);
}
