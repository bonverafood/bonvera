import { setRequestLocale } from "next-intl/server";

import { PdfCatalogPage } from "@/features/pdf-studio";
import { ensureStudioDynamic } from "@/lib/studio/dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PdfCatalogRoutePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  await ensureStudioDynamic();
  return <PdfCatalogPage />;
}
