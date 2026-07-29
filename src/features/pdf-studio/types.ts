import type { Locale } from "@/config/i18n";

export type CatalogProduct = {
  id: string;
  name: string;
  summary: string;
  imageUrl: string | null;
  slug: string;
};

export type CatalogBackCover = {
  location: string;
  email: string;
  phone: string;
  website: string;
  websiteUrl: string;
  tagline: string;
  qrLabel: string;
  qrUrl: string;
};

export type CatalogDocumentProps = {
  products: CatalogProduct[];
  locale: Locale;
  logoUrl: string;
  title: string;
  subtitle: string;
  generatedLabel: string;
  pageLabel: string;
  productCountLabel: string;
  siteLabel: string;
  back: CatalogBackCover;
};

export const CATALOG_PRODUCTS_PER_PAGE = 5;
