"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/config/i18n";
import { locales } from "@/config/i18n";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const LOCALE_FLAGS: Record<Locale, { flag: string; label: string }> = {
  fr: { flag: "🇫🇷", label: "Français" },
  tr: { flag: "🇹🇷", label: "Türkçe" },
};

type MarketingLocaleSwitchProps = {
  className?: string;
  /** Hero üzerindeyken açık renk */
  overHero?: boolean;
};

/**
 * Current-locale flag; click opens other languages and switches the page locale.
 */
export function MarketingLocaleSwitch({
  className,
  overHero = false,
}: MarketingLocaleSwitchProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LOCALE_FLAGS[locale];
  const others = locales.filter((code) => code !== locale);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current.label}
        title={current.label}
        className={cn(
          "flex size-9 items-center justify-center rounded-full text-lg leading-none transition-colors",
          overHero
            ? "bg-white/10 text-white ring-1 ring-white/35 hover:bg-white/20"
            : "bg-muted/50 text-foreground ring-1 ring-border hover:bg-muted",
          open &&
            (overHero
              ? "bg-white/25 ring-white/55"
              : "bg-background shadow-sm"),
        )}
      >
        <span aria-hidden>{current.flag}</span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Language"
          className={cn(
            "absolute top-full right-0 z-50 mt-2 min-w-[9.5rem] overflow-hidden rounded-xl border py-1 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.45)]",
            overHero
              ? "border-white/20 bg-[var(--marketing-navy-deep)] text-white"
              : "border-border bg-card text-card-foreground",
          )}
        >
          {others.map((code) => {
            const meta = LOCALE_FLAGS[code];
            return (
              <li key={code} role="option">
                <button
                  type="button"
                  onClick={() => switchTo(code)}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
                    overHero
                      ? "hover:bg-white/10"
                      : "hover:bg-muted",
                  )}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {meta.flag}
                  </span>
                  <span>{meta.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
