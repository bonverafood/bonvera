import { setRequestLocale } from "next-intl/server";

import { ProductEditor } from "@/features/product-studio";

type NewProductPageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function NewProductPage({ params }: NewProductPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProductEditor mode="create" />;
}
