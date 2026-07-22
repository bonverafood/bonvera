import { setRequestLocale } from "next-intl/server";

import { StudioHomeGate } from "@/features/studio-setup";

type StudioHomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function StudioHomePage({ params }: StudioHomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <StudioHomeGate />;
}
