import type { Metadata } from "next";
import type { ReactNode } from "react";

type StudioLayoutProps = {
  children: ReactNode;
};

/** Auth cookie reads — Studio must always render on the server per request. */
export const dynamic = "force-dynamic";

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

export default function StudioLayout({ children }: StudioLayoutProps) {
  return <div data-surface="studio">{children}</div>;
}
