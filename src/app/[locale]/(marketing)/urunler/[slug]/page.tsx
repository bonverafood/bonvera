import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  getMarketingProduct,
  MARKETING_PRODUCTS,
} from "@/features/marketing-site";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedProductBySlug } from "@/lib/data";
import { Link } from "@/lib/i18n/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return MARKETING_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const dbProduct = await getPublishedProductBySlug(slug);
    if (dbProduct) {
      const title = dbProduct.seoTitleTr?.trim() || dbProduct.nameTr;
      const description =
        dbProduct.seoDescriptionTr?.trim() ||
        dbProduct.summaryTr?.trim() ||
        title;
      const ogImage =
        dbProduct.ogImageUrl?.trim() || dbProduct.imageUrl?.trim() || null;
      const path = `/urunler/${dbProduct.slug}`;
      const canonical = siteConfig.canonicalUrl(path);
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
          title,
          description,
          url: canonical,
          siteName: "Bonvera",
          type: "website",
          images: ogImage ? [{ url: ogImage }] : undefined,
        },
        twitter: {
          card: ogImage ? "summary_large_image" : "summary",
          title,
          description,
          images: ogImage ? [ogImage] : undefined,
        },
      };
    }
  } catch (error) {
    console.warn("[seo] product metadata db fallback", slug, error);
  }

  const product = getMarketingProduct(slug);
  if (!product) {
    return {};
  }
  const t = await getTranslations("Marketing");
  const title = t(product.nameKey);
  const description = t(product.summaryKey);
  const path = `/urunler/${product.slug}`;
  const canonical = siteConfig.canonicalUrl(path);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Bonvera",
      type: "website",
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getMarketingProduct(slug);
  if (!product) {
    notFound();
  }

  const t = await getTranslations("Marketing");

  return (
    <article>
      <div className="relative min-h-[48vh] overflow-hidden bg-[var(--marketing-hero)]">
        <Image
          src={product.image}
          alt=""
          fill
          priority
          className="object-cover opacity-80"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,24,0.35)_0%,rgba(12,16,24,0.75)_100%)]" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-6xl flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs tracking-[0.16em] text-white/70 uppercase">
            {t(product.categoryKey)}
          </p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            {t(product.nameKey)}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-muted-foreground text-lg leading-relaxed">
          {t(product.summaryKey)}
        </p>
        <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
          {t("products.detailPlaceholder")}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/iletisim"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
          >
            {t("products.detailCta")}
          </Link>
          <Link
            href="/urunler"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 px-5",
            )}
          >
            {t("products.back")}
          </Link>
        </div>
      </div>
    </article>
  );
}
