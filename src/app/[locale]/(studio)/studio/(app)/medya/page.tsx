import { setRequestLocale } from "next-intl/server";

import { MediaStudioPage } from "@/features/media-studio/components/media-studio-page";
import { ensureStudioDynamic } from "@/lib/studio/dynamic";

type PageProps = { params: Promise<{ locale: string }> };

/** Must be on the page — layout-only force-dynamic is masked by locale SSG. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MediaPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  await ensureStudioDynamic();
  return <MediaStudioPage />;
}
