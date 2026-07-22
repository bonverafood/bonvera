import { unstable_noStore as noStore } from "next/cache";
import { getTranslations } from "next-intl/server";

import { listProducts } from "@/lib/data";
import type { Product } from "@/lib/data/types";

import { ProductCardBoard } from "./product-card-board";

/** Auth via middleware only — no cookies() in this RSC. */
export async function ProductListPage() {
  noStore();
  const t = await getTranslations("ProductStudio");

  let items: Product[] = [];
  let loadError: string | null = null;

  try {
    items = await listProducts();
  } catch (error) {
    console.error("[product-studio] list", error);
    loadError =
      error instanceof Error ? error.message : "Urun listesi yuklenemedi.";
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("listTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("listDescription")}</p>
        </header>
        <p className="text-destructive text-sm" role="alert">
          {loadError}
        </p>
      </div>
    );
  }

  const safeItems = JSON.parse(JSON.stringify(items)) as Product[];

  return <ProductCardBoard initialItems={safeItems} />;
}
