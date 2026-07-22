"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useStudioShellUi } from "../store";

export function StudioUserMenu() {
  const t = useTranslations("StudioShell");
  const open = useStudioShellUi((s) => s.userMenuOpen);
  const setOpen = useStudioShellUi((s) => s.setUserMenuOpen);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(!open)}
        className="gap-2 px-2"
      >
        <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full text-[11px] font-semibold">
          AY
        </span>
        <span className="hidden text-left sm:block">
          <span className="text-foreground block text-sm leading-tight font-medium">
            {t("user.name")}
          </span>
          <span className="text-muted-foreground block text-[11px] leading-tight">
            {t("user.role")}
          </span>
        </span>
        <ChevronDown
          className="text-muted-foreground size-3.5 opacity-70"
          aria-hidden
        />
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label={t("user.close")}
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className={cn(
              "border-border bg-card absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border py-1 shadow-[var(--studio-shadow)]",
            )}
          >
            <div className="border-border border-b px-3 py-2.5 sm:hidden">
              <p className="text-sm font-medium">{t("user.name")}</p>
              <p className="text-muted-foreground text-xs">{t("user.role")}</p>
            </div>
            {(
              [
                "user.menu.profile",
                "user.menu.preferences",
                "user.menu.help",
              ] as const
            ).map((key) => (
              <button
                key={key}
                type="button"
                role="menuitem"
                className="hover:bg-muted text-foreground w-full px-3 py-2 text-left text-sm transition-colors"
                onClick={() => setOpen(false)}
              >
                {t(key)}
              </button>
            ))}
            <div className="border-border border-t">
              <button
                type="button"
                role="menuitem"
                className="text-muted-foreground hover:bg-muted w-full px-3 py-2 text-left text-sm transition-colors"
                onClick={() => setOpen(false)}
              >
                {t("user.menu.signOut")}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
