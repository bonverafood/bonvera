"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { WEEKDAY_OPTIONS } from "../../constants";
import { useAutosaveDraft } from "../../hooks/use-autosave-draft";
import { useSetupStepForm } from "../../hooks/use-setup-step-form";
import { createHoursStepSchema, type HoursStepValues } from "../../schema";
import { useSetupStore } from "../../store";
import type { Weekday } from "../../types";
import { Field } from "../field";
import { SETUP_FORM_ID } from "../setup-nav";

type HoursStepProps = {
  onValid: () => void;
};

export function HoursStep({ onValid }: HoursStepProps) {
  const t = useTranslations("StudioSetup");
  const draft = useSetupStore((state) => state.getActiveDraft());
  const { saveHours } = useAutosaveDraft();

  const schema = useMemo(() => createHoursStepSchema(t), [t]);

  const onAutosave = useCallback(
    (values: HoursStepValues) => {
      saveHours({
        opening: values.opening ?? "09:00",
        closing: values.closing ?? "18:00",
        workingDays: (values.workingDays ?? []).filter((day): day is Weekday =>
          Boolean(day),
        ),
      });
    },
    [saveHours],
  );

  const onCommit = useCallback(
    (values: HoursStepValues) => {
      saveHours(values, true);
    },
    [saveHours],
  );

  const { form, onSubmit } = useSetupStepForm<HoursStepValues>({
    schema,
    defaultValues: draft?.hours ?? {
      opening: "09:00",
      closing: "18:00",
      workingDays: ["mon", "tue", "wed", "thu", "fri"],
    },
    onAutosave,
    onCommit,
    onValid,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  const workingDaysErrorId = errors.workingDays
    ? "working-days-error"
    : undefined;

  return (
    <form
      id={SETUP_FORM_ID}
      className="flex flex-col gap-5"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          id="hours-opening"
          label={t("fields.opening")}
          error={errors.opening?.message}
        >
          <Input id="hours-opening" type="time" {...register("opening")} />
        </Field>

        <Field
          id="hours-closing"
          label={t("fields.closing")}
          error={errors.closing?.message}
        >
          <Input id="hours-closing" type="time" {...register("closing")} />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-medium">
          {t("fields.workingDays")}
        </legend>
        <Controller
          control={control}
          name="workingDays"
          render={({ field }) => (
            <ul
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              aria-describedby={workingDaysErrorId}
            >
              {WEEKDAY_OPTIONS.map((day) => {
                const checked = field.value.includes(day.value);
                return (
                  <li key={day.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={checked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          field.onChange([...field.value, day.value]);
                        } else {
                          field.onChange(
                            field.value.filter((item) => item !== day.value),
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`day-${day.value}`} className="font-normal">
                      {t(day.labelKey)}
                    </Label>
                  </li>
                );
              })}
            </ul>
          )}
        />
        {errors.workingDays?.message ? (
          <p
            id={workingDaysErrorId}
            role="alert"
            className="text-destructive text-xs"
          >
            {errors.workingDays.message}
          </p>
        ) : null}
      </fieldset>
    </form>
  );
}
