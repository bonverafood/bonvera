import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { routing } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/navigation";
import {
  getPublishedProductBySlug,
  listPublishedProducts,
  localizeProduct,
} from "@/lib/data";
import { getProductJsonLd, jsonLdScript } from "@/lib/seo";
import { cn } from "@/lib/utils";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await listPublishedProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

function productPath(slug: string, locale: string) {
  const path = `/urunler/${slug}`;
  if (locale === routing.defaultLocale) return path;
  return `/${locale}${path}`;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const dbProduct = await getPublishedProductBySlug(slug).catch(() => null);
  if (!dbProduct) {
    return {};
  }

  const content = localizeProduct(dbProduct, locale as Locale);
  const path = productPath(slug, locale);
  const canonical = siteConfig.canonicalUrl(path);
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [
      loc,
      siteConfig.canonicalUrl(productPath(slug, loc)),
    ]),
  );
  languages["x-default"] = siteConfig.canonicalUrl(productPath(slug, "tr"));

  const ogImage = content.ogImageUrl
    ? content.ogImageUrl.startsWith("http")
      ? content.ogImageUrl
      : siteConfig.canonicalUrl(content.ogImageUrl)
    : undefined;

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
      url: canonical,
      siteName: "Bonvera",
      locale: locale === "fr" ? "fr_FR" : "tr_TR",
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: content.seoTitle,
      description: content.seoDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getPublishedProductBySlug(slug).catch(() => null);
  if (!product) {
    notFound();
  }

  const t = await getTranslations("Marketing");
  const content = localizeProduct(product, locale as Locale);
  const path = productPath(slug, locale);
  const canonical = siteConfig.canonicalUrl(path);
  const absoluteImage = content.imageUrl
    ? content.imageUrl.startsWith("http")
      ? content.imageUrl
      : siteConfig.canonicalUrl(content.imageUrl)
    : null;

  const jsonLd = getProductJsonLd({
    name: content.name,
    description: content.seoDescription,
    imageUrl: absoluteImage,
    url: canonical,
  });

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <div className="relative min-h-[48vh] overflow-hidden bg-[var(--marketing-hero)]">
        {content.imageUrl ? (
          <Image
            src={content.imageUrl}
            alt={content.name}
            fill
            priority
            className="object-cover object-[28%_center] opacity-80"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,24,0.35)_0%,rgba(12,16,24,0.75)_100%)]" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-6xl flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs tracking-[0.16em] text-white/70 uppercase">
            Strasbourg · France
          </p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            {content.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {content.summary ? (
          <p className="text-muted-foreground text-lg leading-relaxed">
            {content.summary}
          </p>
        ) : null}
        {content.body && content.body !== content.summary ? (
          <div className="text-muted-foreground mt-6 space-y-4 text-sm leading-relaxed whitespace-pre-wrap">
            {content.body}
          </div>
        ) : null}
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
