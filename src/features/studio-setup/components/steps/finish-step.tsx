"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/i18n/navigation";

import {
  COMPANY_TYPE_OPTIONS,
  getCountryName,
  getLanguageName,
  WEEKDAY_OPTIONS,
} from "../../constants";
import { createFullBrandDraftSchema } from "../../schema";
import { useSetupStore } from "../../store";

export function FinishStep() {
  const t = useTranslations("StudioSetup");
  const router = useRouter();
  const draft = useSetupStore((state) => state.getActiveDraft());
  const markComplete = useSetupStore((state) => state.markComplete);
  const setStepIndex = useSetupStore((state) => state.setStepIndex);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const schema = useMemo(() => createFullBrandDraftSchema(t), [t]);

  if (!draft) return null;

  const companyTypeLabel = COMPANY_TYPE_OPTIONS.find(
    (item) => item.value === draft.company.type,
  )?.labelKey;

  const workingDays = draft.hours.workingDays
    .map((day) => {
      const key = WEEKDAY_OPTIONS.find((item) => item.value === day)?.labelKey;
      return key ? t(key) : day;
    })
    .join(", ");

  const languages = [
    getLanguageName(draft.languages.defaultLocale),
    ...draft.languages.additionalLocales.map(getLanguageName),
  ].join(", ");

  function goToStudio() {
    const result = schema.safeParse(draft);
    if (!result.success) {
      setCompletionError(t("errors.incompleteDraft"));
      // Send user back to the first invalid step (skip welcome/finish).
      const path = result.error.issues[0]?.path[0];
      const stepBySection: Record<string, number> = {
        brand: 1,
        company: 2,
        contact: 3,
        social: 4,
        languages: 5,
        hours: 6,
      };
      if (typeof path === "string" && path in stepBySection) {
        setStepIndex(stepBySection[path]);
      }
      return;
    }

    setCompletionError(null);
    markComplete();
    router.push("/studio");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          {t("brandMark")}
        </p>
        <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("steps.finish.ready")}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("steps.finish.description")}
        </p>
      </div>

      <dl className="border-border/70 divide-border/60 divide-y rounded-xl border">
        <SummaryRow label={t("summary.brand")} value={draft.brand.name} />
        <SummaryRow
          label={t("summary.company")}
          value={[
            draft.company.name,
            companyTypeLabel ? t(companyTypeLabel) : null,
            draft.company.city,
            getCountryName(draft.company.country),
          ]
            .filter(Boolean)
            .join(" · ")}
        />
        <SummaryRow label={t("summary.email")} value={draft.contact.email} />
        <SummaryRow label={t("summary.languages")} value={languages} />
        <SummaryRow
          label={t("summary.hours")}
          value={`${draft.hours.opening} – ${draft.hours.closing} · ${workingDays}`}
        />
      </dl>

      {completionError ? (
        <p role="alert" className="text-destructive text-sm">
          {completionError}
        </p>
      ) : null}

      <Button type="button" size="lg" onClick={goToStudio}>
        {t("steps.finish.cta")}
      </Button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-foreground text-sm sm:text-right">{value}</dd>
    </div>
  );
}
