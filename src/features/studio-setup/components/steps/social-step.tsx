"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { Input } from "@/components/ui/input";

import { useAutosaveDraft } from "../../hooks/use-autosave-draft";
import { useSetupStepForm } from "../../hooks/use-setup-step-form";
import { createSocialStepSchema, type SocialStepValues } from "../../schema";
import { useSetupStore } from "../../store";
import { Field } from "../field";
import { SETUP_FORM_ID } from "../setup-nav";

type SocialStepProps = {
  onValid: () => void;
};

const SOCIAL_FIELDS = [
  ["instagram", "fields.instagram"],
  ["facebook", "fields.facebook"],
  ["linkedin", "fields.linkedin"],
  ["youtube", "fields.youtube"],
  ["tiktok", "fields.tiktok"],
] as const;

export function SocialStep({ onValid }: SocialStepProps) {
  const t = useTranslations("StudioSetup");
  const draft = useSetupStore((state) => state.getActiveDraft());
  const { saveSocial } = useAutosaveDraft();

  const schema = useMemo(() => createSocialStepSchema(), []);

  const onAutosave = useCallback(
    (values: SocialStepValues) => {
      saveSocial({
        instagram: values.instagram ?? "",
        facebook: values.facebook ?? "",
        linkedin: values.linkedin ?? "",
        youtube: values.youtube ?? "",
        tiktok: values.tiktok ?? "",
      });
    },
    [saveSocial],
  );

  const onCommit = useCallback(
    (values: SocialStepValues) => {
      saveSocial(values, true);
    },
    [saveSocial],
  );

  const { form, onSubmit } = useSetupStepForm<SocialStepValues>({
    schema,
    defaultValues: draft?.social ?? {
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
    },
    onAutosave,
    onCommit,
    onValid,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form
      id={SETUP_FORM_ID}
      className="flex flex-col gap-5"
      onSubmit={onSubmit}
      noValidate
    >
      <p className="text-muted-foreground text-sm">{t("steps.social.empty")}</p>

      {SOCIAL_FIELDS.map(([name, labelKey]) => (
        <Field
          key={name}
          id={`social-${name}`}
          label={t(labelKey)}
          error={errors[name]?.message}
        >
          <Input id={`social-${name}`} {...register(name)} />
        </Field>
      ))}
    </form>
  );
}
