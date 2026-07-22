"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

import { useStudioShellUi } from "../store";

export function StudioUserMenu() {
  const t = useTranslations("StudioShell");
  const open = useStudioShellUi((s) => s.userMenuOpen);
  const setOpen = useStudioShellUi((s) => s.setUserMenuOpen);
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!cancelled) {
          setEmail(user?.email ?? null);
        }
      } catch {
        if (!cancelled) setEmail(null);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const initials = email
    ? email.split("@")[0]!.slice(0, 2).toUpperCase()
    : "BV";

  async function handleSignOut() {
    setSigningOut(true);
    setOpen(false);
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      router.replace("/studio/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

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
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="text-foreground block max-w-[10rem] truncate text-sm leading-tight font-medium">
            {email ?? t("user.name")}
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
              <p className="truncate text-sm font-medium">
                {email ?? t("user.name")}
              </p>
              <p className="text-muted-foreground text-xs">{t("user.role")}</p>
            </div>
            <div className="border-border border-t">
              <button
                type="button"
                role="menuitem"
                disabled={signingOut}
                className="text-muted-foreground hover:bg-muted w-full px-3 py-2 text-left text-sm transition-colors disabled:opacity-50"
                onClick={() => void handleSignOut()}
              >
                {signingOut
                  ? t("user.menu.signingOut")
                  : t("user.menu.signOut")}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
