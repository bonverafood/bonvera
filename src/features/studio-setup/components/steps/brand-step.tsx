"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useAutosaveDraft } from "../../hooks/use-autosave-draft";
import { useSetupStepForm } from "../../hooks/use-setup-step-form";
import { readFileAsDataUrl, validateLogoFile } from "../../lib/logo";
import { createBrandStepSchema, type BrandStepValues } from "../../schema";
import { useSetupStore } from "../../store";
import { Field } from "../field";
import { SETUP_FORM_ID } from "../setup-nav";

type BrandStepProps = {
  onValid: () => void;
};

export function BrandStep({ onValid }: BrandStepProps) {
  const t = useTranslations("StudioSetup");
  const draft = useSetupStore((state) => state.getActiveDraft());
  const { saveBrand } = useAutosaveDraft();

  const schema = useMemo(() => createBrandStepSchema(t), [t]);

  const onAutosave = useCallback(
    (values: BrandStepValues) => {
      saveBrand({
        name: values.name ?? "",
        logoDataUrl: values.logoDataUrl ?? null,
        description: values.description ?? "",
      });
    },
    [saveBrand],
  );

  const onCommit = useCallback(
    (values: BrandStepValues) => {
      saveBrand(values, true);
    },
    [saveBrand],
  );

  const { form, onSubmit } = useSetupStepForm<BrandStepValues>({
    schema,
    defaultValues: draft?.brand ?? {
      name: "",
      logoDataUrl: null,
      description: "",
    },
    onAutosave,
    onCommit,
    onValid,
  });

  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const logoDataUrl = watch("logoDataUrl");

  async function onLogoChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) {
      clearErrors("logoDataUrl");
      setValue("logoDataUrl", null, { shouldDirty: true });
      return;
    }

    const issue = validateLogoFile(file);
    if (issue === "type") {
      setError("logoDataUrl", { message: t("errors.logoType") });
      setValue("logoDataUrl", null, { shouldDirty: true });
      return;
    }
    if (issue === "size") {
      setError("logoDataUrl", { message: t("errors.logoSize") });
      setValue("logoDataUrl", null, { shouldDirty: true });
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      clearErrors("logoDataUrl");
      setValue("logoDataUrl", dataUrl, { shouldDirty: true });
    } catch {
      setError("logoDataUrl", { message: t("errors.logoType") });
      setValue("logoDataUrl", null, { shouldDirty: true });
    }
  }

  return (
    <form
      id={SETUP_FORM_ID}
      className="flex flex-col gap-5"
      onSubmit={onSubmit}
      noValidate
    >
      <Field
        id="brand-name"
        label={t("fields.brandName")}
        error={errors.name?.message}
      >
        <Input
          id="brand-name"
          autoComplete="organization"
          {...register("name")}
        />
      </Field>

      <Field
        id="brand-logo"
        label={t("fields.brandLogo")}
        hint={t("fields.brandLogoHint")}
        error={errors.logoDataUrl?.message}
      >
        <Input
          id="brand-logo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(event) => {
            void onLogoChange(event.target.files);
          }}
        />
        {logoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoDataUrl}
            alt=""
            className="border-border mt-2 size-16 rounded-lg border object-cover"
          />
        ) : null}
      </Field>

      <Field
        id="brand-description"
        label={t("fields.brandDescription")}
        error={errors.description?.message}
      >
        <Textarea
          id="brand-description"
          rows={4}
          {...register("description")}
        />
      </Field>
    </form>
  );
}
