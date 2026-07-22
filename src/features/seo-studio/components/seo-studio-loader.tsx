import { getTranslations } from "next-intl/server";

import { loadSeoStudio } from "../actions";
import { SeoStudioHub } from "./seo-studio-page";

export async function SeoStudioPage() {
  const t = await getTranslations("SeoStudio");
  const result = await loadSeoStudio();

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
        <p className="text-destructive text-sm" role="alert">
          {result.error}
        </p>
      </div>
    );
  }

  return (
    <SeoStudioHub
      defaults={result.data.defaults}
      pages={result.data.pages}
      audit={result.data.audit}
    />
  );
}
