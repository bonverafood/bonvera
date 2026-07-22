"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

import { getActiveNavId, STUDIO_NAV } from "../constants/nav";
import { useStudioShellUi } from "../store";

type StudioSidebarProps = {
  className?: string;
};

export function StudioSidebar({ className }: StudioSidebarProps) {
  const t = useTranslations("StudioShell");
  const pathname = usePathname();
  const activeId = getActiveNavId(pathname);
  const closeOverlays = useStudioShellUi((s) => s.closeOverlays);

  return (
    <aside
      className={cn(
        "border-sidebar-border bg-sidebar text-sidebar-foreground flex h-full flex-col border-r",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div
          className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-xs font-semibold tracking-wide"
          aria-hidden
        >
          B
        </div>
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-semibold tracking-tight">
            {t("brand")}
          </p>
          <p className="text-muted-foreground truncate text-[11px]">
            {t("brandHint")}
          </p>
        </div>
      </div>

      <nav
        aria-label={t("navLabel")}
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4"
      >
        {STUDIO_NAV.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeId;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={closeOverlays}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
              <span className="truncate">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-sidebar-border mt-auto border-t px-4 py-3">
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          {t("footerHint")}
        </p>
      </div>
    </aside>
  );
}
