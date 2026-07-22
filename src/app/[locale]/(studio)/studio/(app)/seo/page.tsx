import { setRequestLocale } from "next-intl/server";

import { SeoStudioPage } from "@/features/seo-studio/components/seo-studio-loader";
import { ensureStudioDynamic } from "@/lib/studio/dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SeoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  await ensureStudioDynamic();
  return <SeoStudioPage />;
}
