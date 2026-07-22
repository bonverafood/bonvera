import { setRequestLocale } from "next-intl/server";

import { ProductListPage } from "@/features/product-studio/components/product-list-page";
import { ensureStudioDynamic } from "@/lib/studio/dynamic";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudioProductsPage({
  params,
}: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  await ensureStudioDynamic();
  return <ProductListPage />;
}
