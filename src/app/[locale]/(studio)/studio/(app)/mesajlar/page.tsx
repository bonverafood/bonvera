import { setRequestLocale } from "next-intl/server";

import { MessagesStudioPage } from "@/features/messages-studio";
import { ensureStudioDynamic } from "@/lib/studio/dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

export default async function MessagesPage({ params }: PageProps) {
  await ensureStudioDynamic();
  const { locale } = await params;
  setRequestLocale(locale);
  return <MessagesStudioPage />;
}
