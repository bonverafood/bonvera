"use client";

import { useTranslations } from "next-intl";

import type { SiteSeoDefaults, SiteSeoPage } from "@/lib/data/types";

import type { ProductSeoAuditItem } from "../actions";
import { PageSeoForm } from "./page-seo-form";
import { ProductSeoAudit } from "./product-seo-audit";
import { SiteDefaultsForm } from "./site-defaults-form";

type SeoStudioHubProps = {
  defaults: SiteSeoDefaults;
  pages: SiteSeoPage[];
  audit: ProductSeoAuditItem[];
};

export function SeoStudioHub({ defaults, pages, audit }: SeoStudioHubProps) {
  const t = useTranslations("SeoStudio");

  const ordered = [...pages].sort((a, b) => a.path.localeCompare(b.path));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("description")}</p>
      </div>

      <SiteDefaultsForm defaults={defaults} />

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {t("pages.title")}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("pages.description")}
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {ordered.map((page) => (
            <PageSeoForm key={page.id} page={page} />
          ))}
        </div>
      </section>

      <ProductSeoAudit items={audit} />
    </div>
  );
}
