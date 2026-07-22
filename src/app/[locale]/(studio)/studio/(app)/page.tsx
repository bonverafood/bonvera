import { setRequestLocale } from "next-intl/server";

import { StudioDashboard } from "@/features/studio-shell";
import { ensureStudioDynamic } from "@/lib/studio/dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudioDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  await ensureStudioDynamic();
  return <StudioDashboard />;
}
