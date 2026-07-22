import { setRequestLocale } from "next-intl/server";

import { MediaStudioPage } from "@/features/media-studio/components/media-studio-page";

type PageProps = { params: Promise<{ locale: string }> };

export default async function MediaPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MediaStudioPage />;
}
