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

export default function StudioAppLayout({ children }: StudioAppLayoutProps) {
  return <StudioShell>{children}</StudioShell>;
}
