"use client";

import Image from "next/image";
import { CheckSquare, FileDown, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Locale } from "@/config/i18n";
import { StudioEmptyState } from "@/features/studio-shell/components/studio-empty-state";
import { StudioPageHeader } from "@/features/studio-shell/components/studio-page-header";
import { localizeProduct } from "@/lib/data/localize-product";
import type { Product } from "@/lib/data/types";
import { useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import frMessages from "@/messages/fr.json";
import trMessages from "@/messages/tr.json";

import { downloadCatalogPdf } from "../lib/download-catalog";
import type { CatalogProduct } from "../types";

type PdfCatalogBoardProps = {
  products: Product[];
};

type PdfCopy = (typeof trMessages)["PdfStudio"];

function pdfCopyFor(locale: Locale): PdfCopy {
  return locale === "fr" ? frMessages.PdfStudio : trMessages.PdfStudio;
}

function interpolate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function toCatalogProducts(
  products: Product[],
  locale: Locale,
): CatalogProduct[] {
  return products.map((product) => {
    const localized = localizeProduct(product, locale);
    return {
      id: product.id,
      name: localized.name,
      summary: localized.summary,
      imageUrl: localized.imageUrl,
      slug: localized.slug,
    };
  });
}

export function PdfCatalogBoard({ products }: PdfCatalogBoardProps) {
  const t = useTranslations("PdfStudio");
  const router = useRouter();
  const [contentLocale, setContentLocale] = useState<Locale>("tr");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const allIds = useMemo(() => products.map((p) => p.id), [products]);
  const selectedCount = selected.size;
  const allSelected =
    products.length > 0 && selectedCount === products.length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(allIds));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function onGenerate() {
    if (selectedCount === 0) {
      setError(t("needSelection"));
      return;
    }
    setError(null);

    const ordered = products.filter((p) => selected.has(p.id));
    const catalogProducts = toCatalogProducts(ordered, contentLocale);
    const copy = pdfCopyFor(contentLocale);
    const logoUrl = `${window.location.origin}/brand/logo.png`;
    const stamp = new Date().toISOString().slice(0, 10);
    const year = new Date().getFullYear();
    const websiteUrl = copy.pdfWebsiteUrl;

    startTransition(async () => {
      try {
        await downloadCatalogPdf({
          products: catalogProducts,
          locale: contentLocale,
          logoUrl,
          title: interpolate(copy.pdfTitle, { year }),
          subtitle: copy.pdfSubtitle,
          generatedLabel: copy.pdfGenerated,
          pageLabel: copy.pdfPage,
          productCountLabel: interpolate(copy.pdfProductCount, {
            count: catalogProducts.length,
          }),
          back: {
            location: copy.pdfBackLocation,
            email: copy.pdfBackEmail,
            phone: copy.pdfBackPhone,
            website: copy.pdfBackWebsite,
            websiteUrl,
            tagline: copy.pdfBackTagline,
            qrLabel: copy.pdfQrLabel,
            qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(websiteUrl)}`,
          },
          fileName: `Bonvera-Catalogue-${contentLocale.toUpperCase()}-${stamp}.pdf`,
        });
      } catch (err) {
        console.error("[pdf-studio] generate", err);
        setError(
          err instanceof Error ? err.message : t("generateError"),
        );
      }
    });
  }

  if (products.length === 0) {
    return (
      <div>
        <StudioPageHeader
          title={t("title")}
          description={t("description")}
        />
        <StudioEmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          actionLabel={t("emptyAction")}
          onAction={() => {
            router.push("/studio/urunler");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudioPageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button
            type="button"
            size="lg"
            disabled={pending || selectedCount === 0}
            onClick={onGenerate}
          >
            <FileDown className="size-4" />
            {pending ? t("generating") : t("generate")}
          </Button>
        }
      />

      <div className="border-border bg-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium">
            {t("selectedCount", { count: selectedCount })}
          </p>
          <div
            className="border-border flex items-center gap-1 rounded-lg border p-0.5"
            role="group"
            aria-label={t("contentLanguage")}
          >
            {(["tr", "fr"] as const).map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => setContentLocale(locale)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  contentLocale === locale
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {locale === "tr" ? t("contentLanguageTr") : t("contentLanguageFr")}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={allSelected ? clearSelection : selectAll}
          >
            {allSelected ? (
              <CheckSquare className="size-3.5" />
            ) : (
              <Square className="size-3.5" />
            )}
            {allSelected ? t("clearSelection") : t("selectAll")}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={pending || selectedCount === 0}
            onClick={onGenerate}
          >
            <FileDown className="size-3.5" />
            {pending ? t("generating") : t("generate")}
          </Button>
        </div>
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const localized = localizeProduct(product, contentLocale);
          const isSelected = selected.has(product.id);
          const inputId = `pdf-product-${product.id}`;

          return (
            <li key={product.id}>
              <label
                htmlFor={inputId}
                className={cn(
                  "border-border bg-card flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-[box-shadow,border-color]",
                  isSelected &&
                    "border-primary ring-primary/20 shadow-[var(--studio-shadow)] ring-2",
                )}
              >
                <div className="bg-muted relative aspect-[4/3] w-full">
                  {localized.imageUrl ? (
                    <Image
                      src={localized.imageUrl}
                      alt={localized.name}
                      fill
                      className="object-cover object-[39%_center]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                      Bonvera
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Checkbox
                      id={inputId}
                      checked={isSelected}
                      onChange={() => toggle(product.id)}
                      className="bg-background/90 size-5 shadow-sm"
                      aria-label={t("selectProduct", {
                        name: localized.name,
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5 p-4">
                  <p className="truncate text-base font-semibold">
                    {localized.name}
                  </p>
                  {localized.summary ? (
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {localized.summary}
                    </p>
                  ) : null}
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
