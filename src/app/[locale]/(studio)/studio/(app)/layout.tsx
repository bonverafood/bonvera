import type { Metadata } from "next";
import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";

import { StudioShell } from "@/features/studio-shell";

type StudioAppLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: {
    default: "Bonvera Studio",
    template: "%s · Bonvera Studio",
  },
};

export default async function StudioAppLayout({
  children,
  params,
}: StudioAppLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StudioShell>{children}</StudioShell>;
}
