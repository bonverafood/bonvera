"use client";

import { useTranslations } from "next-intl";

import { SETUP_STEPS } from "../constants";
import { cn } from "@/lib/utils";

type SetupProgressProps = {
  currentStepIndex: number;
};

export function SetupProgress({ currentStepIndex }: SetupProgressProps) {
  const t = useTranslations("StudioSetup");
  const total = SETUP_STEPS.length;
  const current = Math.min(currentStepIndex + 1, total);
  const percent = (current / total) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>{t("progress.label", { current, total })}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        aria-label={t("progress.aria")}
        className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
      >
        <div
          className={cn(
            "bg-primary h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
