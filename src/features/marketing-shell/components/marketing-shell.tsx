import type { ReactNode } from "react";

import { MarketingFooter } from "./marketing-footer";
import { MarketingHeader } from "./marketing-header";
import { AskChatWidget } from "@/features/site-messages";

type MarketingShellProps = {
  children: ReactNode;
};

export async function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
      <AskChatWidget />
    </div>
  );
}
