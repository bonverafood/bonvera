"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

import {
  DEFAULT_BRAND_CONTENT_LOCALE,
  LANGUAGE_CATALOG,
  getLanguageName,
} from "../../constants";
import { useAutosaveDraft } from "../../hooks/use-autosave-draft";
import { useSetupStepForm } from "../../hooks/use-setup-step-form";
import {
  createLanguagesStepSchema,
  type LanguagesStepValues,
} from "../../schema";
import { useSetupStore } from "../../store";
import { Field } from "../field";
import { SETUP_FORM_ID } from "../setup-nav";

type LanguagesStepProps = {
  onValid: () => void;
};

export function LanguagesStep({ onValid }: LanguagesStepProps) {
  const t = useTranslations("StudioSetup");
  const draft = useSetupStore((state) => state.getActiveDraft());
  const { saveLanguages } = useAutosaveDraft();
  const [pendingLocale, setPendingLocale] = useState("");

  const schema = useMemo(() => createLanguagesStepSchema(t), [t]);

  const onAutosave = useCallback(
    (values: LanguagesStepValues) => {
      saveLanguages({
        defaultLocale: values.defaultLocale ?? DEFAULT_BRAND_CONTENT_LOCALE,
        additionalLocales: (values.additionalLocales ?? []).filter(Boolean),
      });
    },
    [saveLanguages],
  );

  const onCommit = useCallback(
    (values: LanguagesStepValues) => {
      saveLanguages(values, true);
    },
    [saveLanguages],
  );

  const { form, onSubmit } = useSetupStepForm<LanguagesStepValues>({
    schema,
    defaultValues: draft?.languages ?? {
      defaultLocale: DEFAULT_BRAND_CONTENT_LOCALE,
      additionalLocales: [],
    },
    onAutosave,
    onCommit,
    onValid,
  });

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const defaultLocale = watch("defaultLocale");
  const additionalLocales = watch("additionalLocales");

  const availableToAdd = useMemo(
    () =>
      LANGUAGE_CATALOG.filter(
        (lang) =>
          lang.code !== defaultLocale && !additionalLocales.includes(lang.code),
      ),
    [defaultLocale, additionalLocales],
  );

  function addLanguage() {
    if (!pendingLocale) return;
    if (
      pendingLocale === defaultLocale ||
      additionalLocales.includes(pendingLocale)
    ) {
      return;
    }
    setValue("additionalLocales", [...additionalLocales, pendingLocale], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setPendingLocale("");
  }

  function removeLanguage(code: string) {
    setValue(
      "additionalLocales",
      additionalLocales.filter((item) => item !== code),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  const additionalErrorId = errors.additionalLocales
    ? "additional-locale-error"
    : undefined;
  const additionalHintId = "additional-locale-hint";
  const additionalDescribedBy = errors.additionalLocales
    ? additionalErrorId
    : additionalHintId;

  return (
    <form
      id={SETUP_FORM_ID}
      className="flex flex-col gap-5"
      onSubmit={onSubmit}
      noValidate
    >
      <Field
        id="default-locale"
        label={t("fields.defaultLanguage")}
        error={errors.defaultLocale?.message}
      >
        <Controller
          control={control}
          name="defaultLocale"
          render={({ field }) => (
            <Select
              id="default-locale"
              value={field.value}
              aria-invalid={Boolean(errors.defaultLocale)}
              aria-describedby={
                errors.defaultLocale ? "default-locale-error" : undefined
              }
              onChange={(event) => {
                const next = event.target.value;
                field.onChange(next);
                setValue(
                  "additionalLocales",
                  additionalLocales.filter((code) => code !== next),
                  { shouldDirty: true },
                );
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            >
              {LANGUAGE_CATALOG.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </Select>
          )}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <Field
          id="additional-locale"
          label={t("fields.additionalLanguages")}
          hint={t("fields.additionalLanguagesHint")}
          error={errors.additionalLocales?.message}
        >
          <div className="flex gap-2">
            <Select
              id="additional-locale"
              value={pendingLocale}
              onChange={(event) => setPendingLocale(event.target.value)}
              disabled={availableToAdd.length === 0}
              aria-invalid={Boolean(errors.additionalLocales)}
              aria-describedby={additionalDescribedBy}
            >
              <option value="">{t("fields.selectLanguage")}</option>
              {availableToAdd.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={addLanguage}
              disabled={!pendingLocale}
            >
              {t("fields.addLanguage")}
            </Button>
          </div>
        </Field>

        {additionalLocales.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t("steps.languages.empty")}
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {additionalLocales.map((code) => (
              <li key={code}>
                <Badge variant="secondary" className="gap-1.5 pr-1">
                  {getLanguageName(code)}
                  <button
                    type="button"
                    className="hover:bg-muted rounded px-1 text-xs"
                    onClick={() => removeLanguage(code)}
                    aria-label={t("fields.removeLanguage", {
                      language: getLanguageName(code),
                    })}
                  >
                    ×
                  </button>
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}
