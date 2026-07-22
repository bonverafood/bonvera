import { setRequestLocale } from "next-intl/server";

import { StudioModulePage } from "@/features/studio-shell";

type PageProps = { params: Promise<{ locale: string }> };

export default async function RecipesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StudioModulePage navId="recipes" />;
}
