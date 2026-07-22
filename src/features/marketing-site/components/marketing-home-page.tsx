import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { Link } from "@/lib/i18n/navigation";
import { listPublishedProducts, localizeProduct } from "@/lib/data";
import { cn } from "@/lib/utils";

import { MARKETING_PRODUCTS } from "../data/placeholders";
import { HomeHero } from "./home-hero";
import { Reveal } from "./reveal";

export async function MarketingHomePage() {
  const t = await getTranslations("Marketing");
  const locale = (await getLocale()) as Locale;

  let teaser = MARKETING_PRODUCTS.slice(0, 3).map((p) => ({
    slug: p.slug,
    name: t(p.nameKey),
    summary: t(p.summaryKey),
    image: p.image,
  }));

  try {
    const published = await listPublishedProducts();
    if (published.length > 0) {
      teaser = published.slice(0, 3).map((product) => {
        const content = localizeProduct(product, locale);
        return {
          slug: product.slug,
          name: content.name,
          summary: content.summary,
          image: content.imageUrl || "/brand/product-icli-kofte.jpg",
        };
      });
    }
  } catch (error) {
    console.warn("[marketing] home products", error);
  }

  return (
    <>
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(12rem,0.55fr)] lg:gap-16">
          <div className="max-w-2xl">
            <p className="text-primary mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
              {t("home.story.eyebrow")}
            </p>
            <h2 className="font-display text-foreground text-3xl leading-tight sm:text-4xl">
              {t("home.story.title")}
            </h2>
            <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
              {t("home.story.body")}
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/brand/logo.png"
              alt={t("brand")}
              width={280}
              height={280}
              className="h-auto w-44 object-contain sm:w-56 lg:w-64"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-secondary/60 border-border border-y">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-primary mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
                {t("home.products.eyebrow")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl">
                {t("home.products.title")}
              </h2>
            </div>
            <Link
              href="/urunler"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "self-start",
              )}
            >
              {t("home.products.all")}
            </Link>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {teaser.map((product, index) => (
              <Reveal key={product.slug} delay={index * 0.08}>
                <Link href={`/urunler/${product.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="font-display mt-4 text-2xl">{product.name}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {product.summary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-accent mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
              {t("home.craft.eyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl">
              {t("home.craft.title")}
            </h2>
            <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
              {t("home.craft.body")}
            </p>
          </div>
          <div className="bg-secondary relative aspect-[5/4] overflow-hidden">
            <Image
              src="/brand/craft-atelier.png"
              alt="Strasbourg atolyesinde gunluk uretim — el emegi ve ozen"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-[var(--marketing-ink)] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-20 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-24">
          <Reveal className="max-w-xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              {t("home.cta.title")}
            </h2>
            <p className="mt-4 text-white/70">{t("home.cta.body")}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/iletisim"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-md bg-white px-5 text-[var(--marketing-ink)] hover:bg-white/90",
              )}
            >
              {t("home.cta.button")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
