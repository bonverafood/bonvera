import { setRequestLocale } from "next-intl/server";

import { StudioModulePage } from "@/features/studio-shell";

type PageProps = { params: Promise<{ locale: string }> };

export default async function BrandSettingsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StudioModulePage navId="brand" />;
}
