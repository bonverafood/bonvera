"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StudioEmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  className?: string;
};

export function StudioEmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: StudioEmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border/80 bg-card flex flex-col items-start gap-5 rounded-2xl border p-8 shadow-[var(--studio-shadow)] sm:p-10",
        className,
      )}
    >
      {icon ? (
        <div className="bg-accent text-accent-foreground flex size-11 items-center justify-center rounded-xl">
          {icon}
        </div>
      ) : null}
      <div className="max-w-lg space-y-2">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <Button type="button" size="lg" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
