import type { Product } from "@/lib/data/types";
import type { Locale } from "@/config/i18n";

export type LocalizedProductContent = {
  name: string;
  summary: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  imageUrl: string | null;
  ogImageUrl: string | null;
  slug: string;
};

/** Pick TR or FR fields with sensible fallbacks for public pages. */
export function localizeProduct(
  product: Product,
  locale: Locale,
): LocalizedProductContent {
  const isFr = locale === "fr";
  const name = (isFr ? product.nameFr : product.nameTr).trim() || product.nameTr;
  const summary =
    (isFr ? product.summaryFr : product.summaryTr).trim() ||
    product.summaryTr ||
    "";
  const body =
    (isFr ? product.bodyFr : product.bodyTr).trim() || product.bodyTr || "";
  const seoTitle =
    (isFr ? product.seoTitleFr : product.seoTitleTr)?.trim() || name;
  const seoDescription =
    (isFr ? product.seoDescriptionFr : product.seoDescriptionTr)?.trim() ||
    summary ||
    name;

  return {
    name,
    summary,
    body,
    seoTitle,
    seoDescription,
    imageUrl: product.imageUrl,
    ogImageUrl: product.ogImageUrl ?? product.imageUrl,
    slug: product.slug,
  };
}
