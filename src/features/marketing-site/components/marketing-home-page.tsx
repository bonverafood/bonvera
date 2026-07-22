import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

import { MARKETING_PRODUCTS } from "../data/placeholders";
import { HomeHero } from "./home-hero";
import { Reveal } from "./reveal";

export async function MarketingHomePage() {
  const t = await getTranslations("Marketing");

  return (
    <>
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="text-primary mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
            {t("home.story.eyebrow")}
          </p>
          <h2 className="font-display text-foreground text-3xl leading-tight sm:text-4xl">
            {t("home.story.title")}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
            {t("home.story.body")}
          </p>
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
            {MARKETING_PRODUCTS.map((product, index) => (
              <Reveal key={product.slug} delay={index * 0.08}>
                <Link href={`/urunler/${product.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden">
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
                  <h3 className="font-display mt-1 text-2xl">
                    {t(product.nameKey)}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {t(product.summaryKey)}
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
              src="/brand/product-icli-kofte.jpg"
              alt=""
              fill
              className="object-cover"
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
