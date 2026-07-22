import type { Metadata } from "next";
import type { ReactNode } from "react";

import { StudioShell } from "@/features/studio-shell";

type StudioAppLayoutProps = {
  children: ReactNode;
};

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
export default function StudioAppLayout({ children }: StudioAppLayoutProps) {
  return <StudioShell>{children}</StudioShell>;
}
