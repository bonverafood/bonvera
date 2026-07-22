import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MarketingHomePage } from "@/features/marketing-site";
import { buildPageMetadata } from "@/lib/seo";

type MarketingHomeRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Marketing");
  return buildPageMetadata("home", {
    title: t("home.metaTitle"),
    description: t("home.metaDescription"),
  });
}

export default async function MarketingHomeRoute({
  params,
}: MarketingHomeRouteProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MarketingHomePage />;
}
