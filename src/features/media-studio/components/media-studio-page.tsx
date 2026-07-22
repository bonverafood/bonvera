import { connection } from "next/server";
import { getTranslations } from "next-intl/server";

import { listMediaAssets } from "@/lib/data";
import { getStudioUser } from "@/lib/supabase/auth";

import { MediaLibrary } from "./media-library";

export async function MediaStudioPage() {
  // Opt into request-time rendering without force-dynamic layout fights.
  await connection();

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
    return <MediaLibrary initialItems={items} />;
  } catch (error) {
    console.error("[media-studio] page", error);
    const message =
      error instanceof Error ? error.message : "Medya listesi yuklenemedi.";
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
        <p className="text-destructive text-sm" role="alert">
          {message}
        </p>
      </div>
    );
  }
}
