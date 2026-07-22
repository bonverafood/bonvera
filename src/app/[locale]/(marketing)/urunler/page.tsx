import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  MarketingPageIntro,
  MARKETING_PRODUCTS,
} from "@/features/marketing-site";
import { Link } from "@/lib/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Marketing");
  return buildPageMetadata("urunler", {
    title: t("products.metaTitle"),
    description: t("products.metaDescription"),
  });
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Marketing");

  return (
    <>
      <MarketingPageIntro
        eyebrow={t("products.eyebrow")}
        title={t("products.title")}
        description={t("products.description")}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {MARKETING_PRODUCTS.map((product) => (
            <Link
              key={product.slug}
              href={`/urunler/${product.slug}`}
              className="group block"
            >
              <div className="bg-secondary relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="text-muted-foreground mt-4 text-xs tracking-[0.14em] uppercase">
                {t(product.categoryKey)}
              </p>
              <h2 className="font-display mt-1 text-2xl">
                {t(product.nameKey)}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {t(product.summaryKey)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
