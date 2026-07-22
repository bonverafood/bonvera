import { setRequestLocale } from "next-intl/server";

import { MarketingHomePage } from "@/features/marketing-site";

type MarketingHomeRouteProps = {
  params: Promise<{ locale: string }>;
};

export default async function MarketingHomeRoute({
  params,
}: MarketingHomeRouteProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MarketingHomePage />;
}
