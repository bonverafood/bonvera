import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { getProduct, ProductEditor } from "@/features/product-studio";

type EditProductPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const result = await getProduct(id);
  if (!result.ok || !result.data) {
    notFound();
  }

  return <ProductEditor mode="edit" product={result.data} />;
}
