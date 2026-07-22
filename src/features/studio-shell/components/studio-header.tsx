"use client";

import { Menu, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { StudioBreadcrumb } from "./studio-breadcrumb";
import { StudioNotifications } from "./studio-notifications";
import { StudioUserMenu } from "./studio-user-menu";
import { useStudioShellUi } from "../store";

export function StudioHeader() {
  const t = useTranslations("StudioShell");
  const mobileNavOpen = useStudioShellUi((s) => s.mobileNavOpen);
  const setMobileNavOpen = useStudioShellUi((s) => s.setMobileNavOpen);
  const setSearchOpen = useStudioShellUi((s) => s.setSearchOpen);

  return (
    <header className="border-border bg-card/80 supports-backdrop-filter:bg-card/70 sticky top-0 z-30 border-b backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={mobileNavOpen ? t("nav.close") : t("nav.open")}
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? (
            <X className="size-4" />
          ) : (
            <Menu className="size-4" />
          )}
        </Button>

        <StudioBreadcrumb className="min-w-0 flex-1 truncate" />

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSearchOpen(true)}
            className="text-muted-foreground hidden h-8 gap-2 px-2.5 sm:inline-flex"
          >
            <Search className="size-3.5" aria-hidden />
            <span className="text-sm">{t("search.trigger")}</span>
            <kbd className="bg-muted text-muted-foreground ml-2 rounded px-1.5 py-0.5 text-[10px]">
              ⌘K
            </kbd>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label={t("search.trigger")}
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
          </Button>
          <StudioNotifications />
          <StudioUserMenu />
        </div>
      </div>
    </header>
  );
}
