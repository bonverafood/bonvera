import { useTranslations } from "next-intl";

export default function LocaleNotFound() {
  const t = useTranslations("BonveraStudio");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-2 px-6">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground">{t("name")}</p>
    </main>
  );
}
