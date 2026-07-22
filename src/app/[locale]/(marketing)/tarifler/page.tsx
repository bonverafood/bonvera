import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  MarketingPageIntro,
  MARKETING_RECIPES,
} from "@/features/marketing-site";
import { Link } from "@/lib/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";

type RecipesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Marketing");
  return buildPageMetadata("tarifler", {
    title: t("recipes.metaTitle"),
    description: t("recipes.metaDescription"),
  });
}

export default async function RecipesPage({ params }: RecipesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Marketing");

  return (
    <>
      <MarketingPageIntro
        eyebrow={t("recipes.eyebrow")}
        title={t("recipes.title")}
        description={t("recipes.description")}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <ul className="divide-border divide-y border-y">
          {MARKETING_RECIPES.map((recipe) => (
            <li key={recipe.slug}>
              <Link
                href={`/tarifler#${recipe.slug}`}
                id={recipe.slug}
                className="block py-8 transition-opacity hover:opacity-80"
              >
                <h2 className="font-display text-2xl sm:text-3xl">
                  {t(recipe.titleKey)}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
                  {t(recipe.summaryKey)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
