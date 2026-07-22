import { setRequestLocale } from "next-intl/server";

import { SeoStudioPage } from "@/features/seo-studio";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

export default async function SeoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SeoStudioPage />;
}
