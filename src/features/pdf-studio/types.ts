import type { Locale } from "@/config/i18n";

export type CatalogProduct = {
  id: string;
  name: string;
  summary: string;
  body: string;
  imageUrl: string | null;
  slug: string;
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
};
