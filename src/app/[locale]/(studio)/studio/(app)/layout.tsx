import type { Metadata } from "next";
import type { ReactNode } from "react";

import { StudioShell } from "@/features/studio-shell";

type StudioAppLayoutProps = {
  children: ReactNode;
};

/**
 * Studio app shell uses auth cookies on data routes.
 * Keep this layout dynamic so child pages are not frozen as static HTML.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Bonvera Studio",
    template: "%s · Bonvera Studio",
  },
};

export default function StudioAppLayout({ children }: StudioAppLayoutProps) {
  return <StudioShell>{children}</StudioShell>;
}
