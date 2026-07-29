import { createElement } from "react";

import type { Locale } from "@/config/i18n";

import type { CatalogBackCover, CatalogProduct } from "../types";

export type DownloadCatalogOptions = {
  products: CatalogProduct[];
  locale: Locale;
  logoUrl: string;
  title: string;
  subtitle: string;
  generatedLabel: string;
  pageLabel: string;
  productCountLabel: string;
  back: CatalogBackCover;
  fileName: string;
};

let registeredOrigin: string | null = null;

export async function downloadCatalogPdf(
  options: DownloadCatalogOptions,
): Promise<void> {
  const origin = window.location.origin;

  const [{ pdf, Font }, { CatalogDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("../components/catalog-document"),
  ]);

  if (registeredOrigin !== origin) {
    Font.register({
      family: "SourceSans3",
      fonts: [
        {
          src: `${origin}/fonts/SourceSans3-Regular.ttf`,
          fontWeight: 400,
        },
        {
          src: `${origin}/fonts/SourceSans3-Bold.ttf`,
          fontWeight: 700,
        },
      ],
    });
    registeredOrigin = origin;
  }

  const blob = await pdf(
    createElement(CatalogDocument, {
      products: options.products,
      locale: options.locale,
      logoUrl: options.logoUrl,
      title: options.title,
      subtitle: options.subtitle,
      generatedLabel: options.generatedLabel,
      pageLabel: options.pageLabel,
      productCountLabel: options.productCountLabel,
      back: options.back,
    }),
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = options.fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
