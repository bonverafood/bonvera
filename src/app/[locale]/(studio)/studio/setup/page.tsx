import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SetupWizard } from "@/features/studio-setup";

type SetupPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: SetupPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "StudioSetup" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function StudioSetupPage({ params }: SetupPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SetupWizard />;
}
