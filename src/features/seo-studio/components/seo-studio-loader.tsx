import { connection } from "next/server";
import { getTranslations } from "next-intl/server";

import {
  ensureSiteSeoDefaults,
  ensureSiteSeoPages,
  listProducts,
} from "@/lib/data";
import { getStudioUser } from "@/lib/supabase/auth";

import type { ProductSeoAuditItem } from "../actions";
import { SeoStudioHub } from "./seo-studio-page";

export async function SeoStudioPage() {
  await connection();
  const t = await getTranslations("SeoStudio");

  try {
    const user = await getStudioUser();
    if (!user) {
      return (
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </div>
          <p className="text-destructive text-sm" role="alert">
            Oturum gerekli. Tekrar giris yapin.
          </p>
        </div>
      );
    }

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
      <SeoStudioHub defaults={defaults} pages={pages} audit={audit} />
    );
  } catch (error) {
    console.error("[seo-studio] page", error);
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
        <p className="text-destructive text-sm" role="alert">
          {error instanceof Error ? error.message : "SEO yuklenemedi."}
        </p>
      </div>
    );
  }
}
