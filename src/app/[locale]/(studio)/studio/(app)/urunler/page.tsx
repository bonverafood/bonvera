import { setRequestLocale } from "next-intl/server";

import { ProductListPage } from "@/features/product-studio";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function StudioProductsPage({
  params,
}: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProductListPage />;
}
