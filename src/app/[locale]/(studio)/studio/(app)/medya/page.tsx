import { setRequestLocale } from "next-intl/server";

import { MediaStudioPage } from "@/features/media-studio";

type PageProps = { params: Promise<{ locale: string }> };

/** Auth + Supabase service role — must not be statically cached. */
export const dynamic = "force-dynamic";

export default async function MediaPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MediaStudioPage />;
}
