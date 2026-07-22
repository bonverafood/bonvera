import type { Metadata } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";

type MarketingLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalOrigin),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return <div data-surface="marketing">{children}</div>;
}
