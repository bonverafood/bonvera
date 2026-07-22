import type { ReactNode } from "react";

type StudioLayoutProps = {
  children: ReactNode;
};

export default function StudioLayout({ children }: StudioLayoutProps) {
  return <div data-surface="studio">{children}</div>;
}
