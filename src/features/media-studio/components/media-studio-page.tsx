import { getTranslations } from "next-intl/server";

import { listMedia } from "../actions";
import { MediaLibrary } from "./media-library";

export async function MediaStudioPage() {
  const t = await getTranslations("MediaStudio");
  const result = await listMedia();

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
        <p className="text-destructive text-sm" role="alert">
          {result.error}
        </p>
      </div>
    );
  }

  return <MediaLibrary initialItems={result.data} />;
}
