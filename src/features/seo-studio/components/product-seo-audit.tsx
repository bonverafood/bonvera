"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n/navigation";

import type { ProductSeoAuditItem } from "../actions";

type ProductSeoAuditProps = {
  items: ProductSeoAuditItem[];
};

export function ProductSeoAudit({ items }: ProductSeoAuditProps) {
  const t = useTranslations("SeoStudio");

  return (
    <section className="space-y-3 rounded-lg border border-border/70 bg-card/40 p-4 sm:p-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          {t("audit.title")}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("audit.description")}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("audit.empty")}</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {items.map((item) => {
            const gaps: string[] = [];
            if (item.missingTitle) gaps.push(t("audit.gapTitle"));
            if (item.missingDescription) gaps.push(t("audit.gapDescription"));
            if (item.missingOg) gaps.push(t("audit.gapOg"));

            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium">{item.nameTr}</p>
                  <p className="text-muted-foreground font-mono text-xs">
                    /{item.slug}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {gaps.join(" · ")}
                  </p>
                </div>
                <Link
                  href={`/studio/urunler/${item.id}`}
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  {t("audit.edit")}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
