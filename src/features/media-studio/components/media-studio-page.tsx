import { unstable_noStore as noStore } from "next/cache";
import { getTranslations } from "next-intl/server";

import { listMediaAssets } from "@/lib/data";

import { MediaLibrary } from "./media-library";

/**
 * Auth is enforced by middleware for /studio/* (except login).
 * Do not call cookies()/getStudioUser here — that fights next-intl SSG
 * and 500s authenticated RSC renders in production.
 */
export async function MediaStudioPage() {
  noStore();
  const t = await getTranslations("MediaStudio");

  try {
    const items = await listMediaAssets();
    const safeItems = JSON.parse(JSON.stringify(items)) as typeof items;
    return <MediaLibrary initialItems={safeItems} />;
  } catch (error) {
    console.error("[media-studio] page", error);
    const message =
      error instanceof Error
        ? `${error.message}${error.stack ? `\n\n${error.stack}` : ""}`
        : "Medya listesi yuklenemedi.";
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
          {message}
        </pre>
      </div>
    );
  }
}
