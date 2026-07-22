import { unstable_noStore as noStore } from "next/cache";
import { getTranslations } from "next-intl/server";

import { listMediaAssets } from "@/lib/data";
import { getStudioUser } from "@/lib/supabase/auth";

import { MediaLibrary } from "./media-library";

export async function MediaStudioPage() {
  noStore();

  const t = await getTranslations("MediaStudio");

  try {
    const user = await getStudioUser();
    if (!user) {
      return (
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </div>
          <p className="text-destructive text-sm" role="alert">
            Oturum gerekli. Tekrar giris yapin.
          </p>
        </div>
      );
    }

    const items = await listMediaAssets();
    // Ensure props are plain JSON-serializable for the client tree.
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
