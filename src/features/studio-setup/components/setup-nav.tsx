"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { SETUP_STEPS } from "../constants";
import { useSetupStore } from "../store";

export const SETUP_FORM_ID = "studio-setup-form";

type SetupNavProps = {
  onBack: () => void;
  showBack: boolean;
  nextLabel?: string;
  nextType?: "submit" | "button";
  onNextClick?: () => void;
  disabled?: boolean;
};

export function SetupNav({
  onBack,
  showBack,
  nextLabel,
  nextType = "submit",
  onNextClick,
  disabled,
}: SetupNavProps) {
  const t = useTranslations("StudioSetup");
  const saveStatus = useSetupStore((state) => state.saveStatus);
  const currentStepIndex = useSetupStore((state) => state.currentStepIndex);
  const isLast = currentStepIndex >= SETUP_STEPS.length - 1;

  const statusLabel =
    saveStatus === "saving"
      ? t("save.saving")
      : saveStatus === "saved"
        ? t("save.saved")
        : null;

  return (
    <div className="border-border/60 mt-8 flex items-center justify-between gap-4 border-t pt-6">
      <div className="text-muted-foreground min-h-5 text-xs" aria-live="polite">
        {statusLabel}
      </div>
      <div className="flex items-center gap-2">
        {showBack ? (
          <Button type="button" variant="ghost" onClick={onBack}>
            {t("nav.back")}
          </Button>
        ) : null}
        {!isLast || nextType === "button" ? (
          <Button
            type={nextType}
            form={nextType === "submit" ? SETUP_FORM_ID : undefined}
            onClick={onNextClick}
            disabled={disabled}
            size="lg"
          >
            {nextLabel ?? t("nav.next")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
