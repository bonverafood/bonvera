"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { StudioHeader } from "./studio-header";
import { StudioSearch } from "./studio-search";
import { StudioSidebar } from "./studio-sidebar";
import { useStudioShellUi } from "../store";

type StudioShellProps = {
  children: ReactNode;
};

export function StudioShell({ children }: StudioShellProps) {
  const mobileNavOpen = useStudioShellUi((s) => s.mobileNavOpen);
  const setMobileNavOpen = useStudioShellUi((s) => s.setMobileNavOpen);

  return (
    <div className="bg-background text-foreground flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden w-60 shrink-0 lg:block xl:w-64">
        <div className="fixed inset-y-0 left-0 w-60 xl:w-64">
          <StudioSidebar />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="bg-foreground/25 absolute inset-0"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-[min(100%,16.5rem)] shadow-[var(--studio-shadow)]",
            )}
          >
            <StudioSidebar />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <StudioHeader />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      <StudioSearch />
    </div>
  );
}
