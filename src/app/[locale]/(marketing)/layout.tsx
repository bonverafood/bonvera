import type { Metadata } from "next";
import type { ReactNode } from "react";

import { MarketingShell } from "@/features/marketing-shell";
import { siteConfig } from "@/config/site";
import { getOrganizationJsonLd, jsonLdScript } from "@/lib/seo";

type MarketingLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalOrigin),
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const organization = getOrganizationJsonLd();

  return (
    <div data-surface="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organization) }}
      />
      <MarketingShell>{children}</MarketingShell>
    </div>
  );
}
