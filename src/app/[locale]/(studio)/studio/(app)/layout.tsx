import type { Metadata } from "next";
import type { ReactNode } from "react";

import { StudioShell } from "@/features/studio-shell";
import { countNewConversations } from "@/lib/data";
import { ensureStudioDynamic } from "@/lib/studio/dynamic";

type StudioAppLayoutProps = {
  children: ReactNode;
};

/** Auth + data routes under the shell must render per request. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    default: "Bonvera Studio",
    template: "%s · Bonvera Studio",
  },
};

/**
 * Locale is already set in `[locale]/layout` via setRequestLocale.
 * Do not call setRequestLocale again here — nested layout `params`
 * can omit parent dynamic segments and crash the whole Studio shell.
 */
export default async function StudioAppLayout({
  children,
}: StudioAppLayoutProps) {
  await ensureStudioDynamic();
  const unreadMessageCount = await countNewConversations().catch(() => 0);
  return (
    <StudioShell unreadMessageCount={unreadMessageCount}>{children}</StudioShell>
  );
}
