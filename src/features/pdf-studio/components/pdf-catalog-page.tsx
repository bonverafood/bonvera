import { unstable_noStore as noStore } from "next/cache";
import { getTranslations } from "next-intl/server";

import { listPublishedProducts } from "@/lib/data";
import type { Product } from "@/lib/data/types";

import { PdfCatalogBoard } from "./pdf-catalog-board";

/** Auth via middleware only — no cookies() in this RSC. */
export async function PdfCatalogPage() {
  noStore();
  const t = await getTranslations("PdfStudio");

  let items: Product[] = [];
  let loadError: string | null = null;

  try {
    items = await listPublishedProducts();
  } catch (error) {
    console.error("[pdf-studio] list", error);
    loadError =
      error instanceof Error ? error.message : t("loadError");
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </header>
        <p className="text-destructive text-sm" role="alert">
          {loadError}
        </p>
      </div>
    );
  }

  const safeItems = JSON.parse(JSON.stringify(items)) as Product[];

  return <PdfCatalogBoard products={safeItems} />;
}
