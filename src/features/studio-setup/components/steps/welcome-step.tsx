"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type WelcomeStepProps = {
  onContinue: () => void;
};

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  const t = useTranslations("StudioSetup");

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          {t("brandMark")}
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("steps.welcome.title")}
        </h1>
        <p className="text-muted-foreground max-w-md text-base leading-relaxed">
          {t("steps.welcome.description")}
        </p>
      </div>
      <Button type="button" size="lg" onClick={onContinue}>
        {t("steps.welcome.cta")}
      </Button>
    </div>
  );
}
