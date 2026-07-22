import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ensureStudioDynamic } from "@/lib/studio/dynamic";

type StudioLayoutProps = {
  children: ReactNode;
};

/**
 * Studio reads auth cookies / request state — never SSG.
 * Without this, generateStaticParams + swallowed cookies() bailouts
 * prerender shell pages and authenticated requests 500 with a stable digest.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Belt-and-suspenders with middleware X-Robots-Tag — admin is never indexed. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function StudioLayout({ children }: StudioLayoutProps) {
  await ensureStudioDynamic();
  return <div data-surface="studio">{children}</div>;
}
