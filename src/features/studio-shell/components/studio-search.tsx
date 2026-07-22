"use client";

import { Search } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Link } from "@/lib/i18n/navigation";

import { STUDIO_NAV } from "../constants/nav";
import { useStudioShellUi } from "../store";

export function StudioSearch() {
  const t = useTranslations("StudioShell");
  const open = useStudioShellUi((s) => s.searchOpen);
  const setSearchOpen = useStudioShellUi((s) => s.setSearchOpen);
  const closeOverlays = useStudioShellUi((s) => s.closeOverlays);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") closeOverlays();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeOverlays, setSearchOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        className="bg-foreground/20 absolute inset-0 backdrop-blur-[2px]"
        aria-label={t("search.close")}
        onClick={closeOverlays}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("search.title")}
        className="border-border bg-card relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border shadow-[var(--studio-shadow)]"
      >
        <div className="border-border flex items-center gap-2 border-b px-3">
          <Search
            className="text-muted-foreground size-4 shrink-0"
            aria-hidden
          />
          <Input
            autoFocus
            placeholder={t("search.placeholder")}
            className="border-0 shadow-none focus-visible:ring-0"
            // UI only — no search logic
            readOnly
          />
          <kbd className="text-muted-foreground hidden rounded-md border px-1.5 py-0.5 text-[10px] sm:inline">
            esc
          </kbd>
        </div>
        <div className="p-2">
          <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium tracking-wide uppercase">
            {t("search.suggestions")}
          </p>
          <ul className="flex flex-col gap-0.5">
            {STUDIO_NAV.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={closeOverlays}
                    className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors"
                  >
                    <Icon className="size-4 opacity-70" aria-hidden />
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="text-muted-foreground px-2.5 py-3 text-xs leading-relaxed">
            {t("search.hint")}
          </p>
        </div>
      </div>
    </div>
  );
}
