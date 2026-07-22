import { setRequestLocale } from "next-intl/server";

import { SeoStudioPage } from "@/features/seo-studio/components/seo-studio-loader";

type PageProps = { params: Promise<{ locale: string }> };

export default async function SeoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SeoStudioPage />;
}
