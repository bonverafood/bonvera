import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { ProductEditor } from "@/features/product-studio";
import { getProductById } from "@/lib/data";

type EditProductPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

/** Auth via middleware only — no cookies() in this RSC. */
export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  noStore();

  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  return (
    <ProductEditor
      mode="edit"
      product={JSON.parse(JSON.stringify(product))}
    />
  );
}
