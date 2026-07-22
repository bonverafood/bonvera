"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useStudioShellUi } from "../store";

const NOTIFICATIONS = [
  {
    id: "1",
    titleKey: "notifications.items.stock.title",
    bodyKey: "notifications.items.stock.body",
    timeKey: "dashboard.time.minutesAgo",
    timeCount: 12,
  },
  {
    id: "2",
    titleKey: "notifications.items.pdf.title",
    bodyKey: "notifications.items.pdf.body",
    timeKey: "dashboard.time.hoursAgo",
    timeCount: 2,
  },
  {
    id: "3",
    titleKey: "notifications.items.fr.title",
    bodyKey: "notifications.items.fr.body",
    timeKey: "dashboard.time.hoursAgo",
    timeCount: 5,
  },
] as const;

export function StudioNotifications() {
  const t = useTranslations("StudioShell");
  const open = useStudioShellUi((s) => s.notificationsOpen);
  const setOpen = useStudioShellUi((s) => s.setNotificationsOpen);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t("notifications.label")}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(!open)}
        className="relative"
      >
        <Bell className="size-4" />
        <span className="bg-primary absolute top-1.5 right-1.5 size-1.5 rounded-full" />
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label={t("notifications.close")}
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label={t("notifications.title")}
            className={cn(
              "border-border bg-card absolute top-full right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border shadow-[var(--studio-shadow)]",
            )}
          >
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold">
                {t("notifications.title")}
              </p>
              <span className="text-muted-foreground text-xs">
                {t("notifications.unread", { count: 2 })}
              </span>
            </div>
            <ul className="max-h-80 divide-y overflow-y-auto">
              {NOTIFICATIONS.map((item) => (
                <li
                  key={item.id}
                  className="hover:bg-muted/60 px-4 py-3 transition-colors"
                >
                  <p className="text-foreground text-sm font-medium">
                    {t(item.titleKey)}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                    {t(item.bodyKey)}
                  </p>
                  <p className="text-muted-foreground mt-1.5 text-[11px]">
                    {t(item.timeKey, { count: item.timeCount })}
                  </p>
                </li>
              ))}
            </ul>
            <div className="border-border border-t px-4 py-2.5">
              <p className="text-muted-foreground text-xs">
                {t("notifications.hint")}
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
