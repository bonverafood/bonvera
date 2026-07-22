"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

import {
  DASHBOARD_STATS,
  LATEST_MESSAGES,
  QUICK_ACTIONS,
  RECENT_ACTIVITY,
  RECENT_PRODUCTS,
} from "../lib/placeholder-data";
import { StudioPageHeader } from "./studio-page-header";

function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-border/80 bg-card flex flex-col rounded-2xl border shadow-[var(--studio-shadow)]",
        className,
      )}
    >
      <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3.5">
        <h2 className="text-foreground text-sm font-semibold tracking-tight">
          {title}
        </h2>
        {action}
      </div>
      <div className="flex-1 p-5">{children}</div>
    </section>
  );
}

export function StudioDashboard() {
  const t = useTranslations("StudioShell");

  return (
    <div>
      <StudioPageHeader
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        actions={
          <Link
            href="/studio/urunler/yeni"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors"
          >
            {t("dashboard.ctaProduct")}
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <div
            key={stat.id}
            className="border-border/80 bg-card rounded-2xl border p-5 shadow-[var(--studio-shadow)]"
          >
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {t(stat.labelKey)}
            </p>
            <p className="text-foreground mt-2 text-3xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {t(stat.hintKey)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Panel
          className="lg:col-span-3"
          title={t("dashboard.recentProducts")}
          action={
            <Link
              href="/studio/urunler"
              className="text-primary text-xs font-medium hover:underline"
            >
              {t("dashboard.viewAll")}
            </Link>
          }
        >
          <ul className="divide-border -my-1 divide-y">
            {RECENT_PRODUCTS.map((product) => (
              <li
                key={product.name}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">
                    {product.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {product.collection}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge
                    variant={
                      product.statusKey.includes("draft")
                        ? "secondary"
                        : "default"
                    }
                    className="font-normal"
                  >
                    {t(product.statusKey)}
                  </Badge>
                  <span className="text-muted-foreground text-[11px]">
                    {product.updatedCount > 0
                      ? t(product.updatedKey, { count: product.updatedCount })
                      : t(product.updatedKey)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          className="lg:col-span-2"
          title={t("dashboard.latestMessages")}
          action={
            <Link
              href="/studio/mesajlar"
              className="text-primary text-xs font-medium hover:underline"
            >
              {t("dashboard.viewAll")}
            </Link>
          }
        >
          <ul className="space-y-4">
            {LATEST_MESSAGES.map((message) => (
              <li key={message.from} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-foreground truncate text-sm font-medium">
                    {message.from}
                  </p>
                  {message.unread ? (
                    <span className="bg-primary size-1.5 shrink-0 rounded-full" />
                  ) : null}
                </div>
                <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  {message.preview}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {t(message.timeKey, { count: message.timeCount })}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Panel title={t("dashboard.seoScore")}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-foreground text-4xl font-semibold tracking-tight tabular-nums">
                78
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("dashboard.seoHint")}
              </p>
            </div>
            <div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
              <div className="bg-primary h-full w-[78%] rounded-full" />
            </div>
          </div>
        </Panel>

        <Panel title={t("dashboard.translation")}>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">Türkçe</span>
              <span className="text-muted-foreground">
                {t("dashboard.translationDone")}
              </span>
            </div>
            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
              <div className="bg-primary h-full w-full rounded-full" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">Français</span>
              <span className="text-muted-foreground">62%</span>
            </div>
            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
              <div className="bg-primary/80 h-full w-[62%] rounded-full" />
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t("dashboard.translationHint")}
            </p>
          </div>
        </Panel>

        <Panel title={t("dashboard.pdfCount")}>
          <p className="text-foreground text-4xl font-semibold tracking-tight tabular-nums">
            3
          </p>
          <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
            {t("dashboard.pdfHint")}
          </p>
          <Link
            href="/studio/pdf-katalog"
            className="border-border hover:bg-muted mt-4 inline-flex h-8 items-center rounded-lg border px-2.5 text-sm font-medium transition-colors"
          >
            {t("dashboard.pdfAction")}
          </Link>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3" title={t("dashboard.activityTitle")}>
          <ul className="space-y-4">
            {RECENT_ACTIVITY.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="bg-primary/15 mt-1.5 size-1.5 shrink-0 rounded-full" />
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-medium">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {t(item.metaKey)}
                    {" · "}
                    {item.timeCount > 0
                      ? t(item.timeKey, { count: item.timeCount })
                      : t(item.timeKey)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="lg:col-span-2" title={t("dashboard.quickActions")}>
          <div className="grid gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="border-border hover:bg-muted inline-flex h-8 items-center justify-start rounded-lg border px-2.5 text-sm font-medium transition-colors"
              >
                {t(action.labelKey)}
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
