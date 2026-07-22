import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";

type MarketingHomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MarketingHomePage({
  params,
}: MarketingHomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Marketing");
  const studio = await getTranslations("Studio");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>
      <p>
        <Link
          href="/studio"
          className="text-primary underline-offset-4 hover:underline"
        >
          {studio("title")}
        </Link>
      </p>
    </main>
  );
}
