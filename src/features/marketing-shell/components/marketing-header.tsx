"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

import { getActiveMarketingNavId, MARKETING_NAV } from "../constants/nav";
import { useMarketingShellUi } from "../store";
import { MarketingLocaleSwitch } from "./marketing-locale-switch";

type MarketingHeaderProps = {
  variant?: "overHero" | "solid";
};

export function MarketingHeader({ variant }: MarketingHeaderProps = {}) {
  const t = useTranslations("Marketing");
  const pathname = usePathname();
  const activeId = getActiveMarketingNavId(pathname);
  const mobileNavOpen = useMarketingShellUi((s) => s.mobileNavOpen);
  const setMobileNavOpen = useMarketingShellUi((s) => s.setMobileNavOpen);
  const normalized = pathname.replace(/\/$/, "") || "/";
  const overHero =
    (variant ?? (normalized === "/" ? "overHero" : "solid")) === "overHero";

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  return (
    <header
      className={cn(
        "z-30 w-full",
        overHero
          ? "absolute inset-x-0 top-0"
          : "border-border/60 bg-background/90 sticky top-0 border-b backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between gap-4 px-4 sm:h-28 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 sm:gap-4"
          aria-label={t("brand")}
        >
          {/* Mark art sits high in the square — crop/scale so the hat aligns with the wordmark. */}
          <span className="relative size-[6.75rem] shrink-0 translate-y-[0.5cm] overflow-hidden sm:size-[7.5rem]">
            <Image
              src="/brand/mark.png"
              alt=""
              fill
              sizes="120px"
              className={cn(
                "scale-[1.55] object-contain object-[center_12%]",
                overHero && "brightness-0 invert",
              )}
              priority
            />
          </span>
          <span
            className={cn(
              "font-display text-xl font-semibold tracking-[0.14em] uppercase sm:text-2xl",
              overHero ? "text-white" : "text-foreground",
            )}
          >
            {t("brand")}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={t("nav.aria")}
        >
          {MARKETING_NAV.map((item) => {
            const active = item.id === activeId;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  overHero
                    ? active
                      ? "text-white"
                      : "text-white/75 hover:text-white"
                    : active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/iletisim"
            className={cn(
              buttonVariants({
                variant: overHero ? "outline" : "default",
                size: "sm",
              }),
              "hidden sm:inline-flex",
              overHero &&
                "border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white",
            )}
          >
            {t("nav.contactCta")}
          </Link>

          <MarketingLocaleSwitch overHero={overHero} />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden",
              overHero && "text-white hover:bg-white/10 hover:text-white",
            )}
            aria-expanded={mobileNavOpen}
            aria-controls="marketing-mobile-nav"
            aria-label={mobileNavOpen ? t("nav.close") : t("nav.open")}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileNavOpen ? (
        <div
          id="marketing-mobile-nav"
          className={cn(
            "border-border bg-background border-t md:hidden",
            overHero && "bg-marketing-hero border-white/10",
          )}
          style={
            overHero
              ? { background: "var(--marketing-hero)", color: "white" }
              : undefined
          }
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-3 text-base font-medium",
                  overHero
                    ? item.id === activeId
                      ? "bg-white/10 text-white"
                      : "text-white/80"
                    : item.id === activeId
                      ? "bg-muted text-primary"
                      : "text-foreground",
                )}
                onClick={() => setMobileNavOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 px-3 py-2">
              <span
                className={cn(
                  "text-sm",
                  overHero ? "text-white/70" : "text-muted-foreground",
                )}
              >
                {t("nav.language")}
              </span>
              <MarketingLocaleSwitch overHero={overHero} />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
