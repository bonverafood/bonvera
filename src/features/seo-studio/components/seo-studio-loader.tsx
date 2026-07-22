import { unstable_noStore as noStore } from "next/cache";
import { getTranslations } from "next-intl/server";

import {
  ensureSiteSeoDefaults,
  ensureSiteSeoPages,
  listProducts,
} from "@/lib/data";

import type { ProductSeoAuditItem } from "../actions";
import { SeoStudioHub } from "./seo-studio-page";

/** Auth via middleware only — no cookies() in this RSC. */
export async function SeoStudioPage() {
  noStore();
  const t = await getTranslations("SeoStudio");

  try {
    const [defaults, pages, products] = await Promise.all([
      ensureSiteSeoDefaults(),
      ensureSiteSeoPages(),
      listProducts(),
    ]);

    const audit: ProductSeoAuditItem[] = products
      .filter((product) => product.status !== "archived")
      .map((product) => ({
        id: product.id,
        nameTr: product.nameTr,
        slug: product.slug,
        status: product.status,
        missingTitle: !product.seoTitleTr?.trim(),
        missingDescription: !product.seoDescriptionTr?.trim(),
        missingOg: !product.ogImageUrl?.trim(),
      }))
      .filter(
        (item) =>
          item.missingTitle || item.missingDescription || item.missingOg,
      );

    return (
      <SeoStudioHub
        defaults={JSON.parse(JSON.stringify(defaults))}
        pages={JSON.parse(JSON.stringify(pages))}
        audit={JSON.parse(JSON.stringify(audit))}
      />
    );
  } catch (error) {
    console.error("[seo-studio] page", error);
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
        <pre
          className="bg-muted text-destructive overflow-x-auto rounded-lg p-3 text-xs whitespace-pre-wrap"
          role="alert"
        >
          {error instanceof Error
            ? `${error.message}${error.stack ? `\n\n${error.stack}` : ""}`
            : "SEO yuklenemedi."}
        </pre>
      </div>
    );
  }
}
