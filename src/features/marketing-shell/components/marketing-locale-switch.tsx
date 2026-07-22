"use client";

import { useLocale } from "next-intl";

import type { Locale } from "@/config/i18n";
import { locales } from "@/config/i18n";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const LOCALE_FLAGS: Record<
  Locale,
  { flag: string; label: string; labelOther: Record<Locale, string> }
> = {
  fr: {
    flag: "🇫🇷",
    label: "Français",
    labelOther: { tr: "Fransızcaya geç", fr: "Passer en français" },
  },
  tr: {
    flag: "🇹🇷",
    label: "Türkçe",
    labelOther: { tr: "Türkçe", fr: "Passer en turc" },
  },
};

type MarketingLocaleSwitchProps = {
  className?: string;
  /** Hero üzerindeyken açık renk */
  overHero?: boolean;
};

/**
 * Bayraklı dil anahtarı — iletişim CTA'nın yanında.
 * Yeni locale eklenince `locales` + LOCALE_FLAGS güncellenir.
 */
export function MarketingLocaleSwitch({
  className,
  overHero = false,
}: MarketingLocaleSwitchProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border p-0.5",
        overHero
          ? "border-white/35 bg-white/10"
          : "border-border bg-muted/40",
        className,
      )}
      role="group"
      aria-label="Dil"
    >
      {locales.map((code) => {
        const meta = LOCALE_FLAGS[code];
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-label={active ? meta.label : meta.labelOther[locale]}
            aria-pressed={active}
            title={meta.label}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-base leading-none transition-colors",
              active
                ? overHero
                  ? "bg-white/25 ring-1 ring-white/50"
                  : "bg-background shadow-sm ring-1 ring-border"
                : overHero
                  ? "opacity-70 hover:bg-white/15 hover:opacity-100"
                  : "opacity-70 hover:bg-background/80 hover:opacity-100",
            )}
          >
            <span aria-hidden>{meta.flag}</span>
          </button>
        );
      })}
    </div>
  );
}
