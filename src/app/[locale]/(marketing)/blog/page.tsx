import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MarketingPageIntro, MARKETING_POSTS } from "@/features/marketing-site";
import { Link } from "@/lib/i18n/navigation";

type BlogPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Marketing");
  return {
    title: t("blog.metaTitle"),
    description: t("blog.metaDescription"),
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Marketing");

  return (
    <>
      <MarketingPageIntro
        eyebrow={t("blog.eyebrow")}
        title={t("blog.title")}
        description={t("blog.description")}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <ul className="divide-border divide-y border-y">
          {MARKETING_POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog#${post.slug}`}
                id={post.slug}
                className="block py-8 transition-opacity hover:opacity-80"
              >
                <h2 className="font-display text-2xl sm:text-3xl">
                  {t(post.titleKey)}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
                  {t(post.summaryKey)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
