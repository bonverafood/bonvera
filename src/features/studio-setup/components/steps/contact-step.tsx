"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { Input } from "@/components/ui/input";

import { useAutosaveDraft } from "../../hooks/use-autosave-draft";
import { useSetupStepForm } from "../../hooks/use-setup-step-form";
import { createContactStepSchema, type ContactStepValues } from "../../schema";
import { useSetupStore } from "../../store";
import { Field } from "../field";
import { SETUP_FORM_ID } from "../setup-nav";

type ContactStepProps = {
  onValid: () => void;
};

export function ContactStep({ onValid }: ContactStepProps) {
  const t = useTranslations("StudioSetup");
  const draft = useSetupStore((state) => state.getActiveDraft());
  const { saveContact } = useAutosaveDraft();

  const schema = useMemo(() => createContactStepSchema(t), [t]);

  const onAutosave = useCallback(
    (values: ContactStepValues) => {
      saveContact({
        email: values.email ?? "",
        phone: values.phone ?? "",
        whatsapp: values.whatsapp ?? "",
        website: values.website ?? "",
      });
    },
    [saveContact],
  );

  const onCommit = useCallback(
    (values: ContactStepValues) => {
      saveContact(values, true);
    },
    [saveContact],
  );

  const { form, onSubmit } = useSetupStepForm<ContactStepValues>({
    schema,
    defaultValues: draft?.contact ?? {
      email: "",
      phone: "",
      whatsapp: "",
      website: "",
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
      <Field
        id="contact-email"
        label={t("fields.email")}
        error={errors.email?.message}
      >
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
      </Field>

      <Field
        id="contact-phone"
        label={t("fields.phone")}
        error={errors.phone?.message}
      >
        <Input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          {...register("phone")}
        />
      </Field>

      <Field
        id="contact-whatsapp"
        label={t("fields.whatsapp")}
        error={errors.whatsapp?.message}
      >
        <Input id="contact-whatsapp" type="tel" {...register("whatsapp")} />
      </Field>

      <Field
        id="contact-website"
        label={t("fields.website")}
        hint={t("fields.websiteHint")}
        error={errors.website?.message}
      >
        <Input
          id="contact-website"
          type="url"
          placeholder="https://"
          {...register("website")}
        />
      </Field>
    </form>
  );
}
