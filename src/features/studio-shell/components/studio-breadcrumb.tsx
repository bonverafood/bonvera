"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

import { getActiveNavId, getNavItem } from "../constants/nav";

type StudioBreadcrumbProps = {
  className?: string;
};

export function StudioBreadcrumb({ className }: StudioBreadcrumbProps) {
  const t = useTranslations("StudioShell");
  const pathname = usePathname();
  const activeId = getActiveNavId(pathname);
  const item = getNavItem(activeId);

  return (
    <nav
      aria-label={t("breadcrumb.label")}
      className={cn(
        "text-muted-foreground flex items-center gap-1.5 text-sm",
        className,
      )}
    >
      <Link href="/studio" className="hover:text-foreground transition-colors">
        {t("nav.dashboard")}
      </Link>
      {activeId !== "dashboard" ? (
        <>
          <ChevronRight className="size-3.5 opacity-50" aria-hidden />
          <span className="text-foreground font-medium">
            {t(item.labelKey)}
          </span>
        </>
      ) : null}
    </nav>
  );
}
