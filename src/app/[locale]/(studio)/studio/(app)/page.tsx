import { setRequestLocale } from "next-intl/server";

import { StudioDashboard } from "@/features/studio-shell";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function StudioDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StudioDashboard />;
}
