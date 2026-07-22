import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MarketingPageIntro } from "@/features/marketing-site";
import type { Locale } from "@/config/i18n";
import { Link } from "@/lib/i18n/navigation";
import { listPublishedProducts, localizeProduct } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
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

  let products: Awaited<ReturnType<typeof listPublishedProducts>> = [];
  try {
    products = await listPublishedProducts();
  } catch (error) {
    console.warn("[marketing] products list", error);
  }

  return (
    <>
      <MarketingPageIntro
        eyebrow={t("products.eyebrow")}
        title={t("products.title")}
        description={t("products.description")}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {products.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t("products.emptyFallback")}
          </p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const content = localizeProduct(product, locale as Locale);
              return (
                <Link
                  key={product.id}
                  href={`/urunler/${product.slug}`}
                  className="group block"
                >
                  <div className="bg-secondary relative aspect-[4/5] overflow-hidden">
                    {content.imageUrl ? (
                      <Image
                        src={content.imageUrl}
                        alt={content.name}
                        fill
                        className="object-cover object-[39%_center] transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <h2 className="font-display mt-4 text-2xl">{content.name}</h2>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {content.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
