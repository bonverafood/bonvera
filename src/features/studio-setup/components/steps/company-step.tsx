"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import { COMPANY_TYPE_OPTIONS, COUNTRY_CATALOG } from "../../constants";
import { useAutosaveDraft } from "../../hooks/use-autosave-draft";
import { useSetupStepForm } from "../../hooks/use-setup-step-form";
import { createCompanyStepSchema, type CompanyStepValues } from "../../schema";
import { useSetupStore } from "../../store";
import { Field } from "../field";
import { SETUP_FORM_ID } from "../setup-nav";

type CompanyStepProps = {
  onValid: () => void;
};

export function CompanyStep({ onValid }: CompanyStepProps) {
  const t = useTranslations("StudioSetup");
  const draft = useSetupStore((state) => state.getActiveDraft());
  const { saveCompany } = useAutosaveDraft();

  const schema = useMemo(() => createCompanyStepSchema(t), [t]);

  const onAutosave = useCallback(
    (values: CompanyStepValues) => {
      saveCompany({
        name: values.name ?? "",
        type: (values.type ?? "") as CompanyStepValues["type"] | "",
        country: values.country ?? "",
        city: values.city ?? "",
        address: values.address ?? "",
      });
    },
    [saveCompany],
  );

  const onCommit = useCallback(
    (values: CompanyStepValues) => {
      saveCompany(values, true);
    },
    [saveCompany],
  );

  const { form, onSubmit } = useSetupStepForm<CompanyStepValues>({
    schema,
    defaultValues: {
      name: draft?.company.name ?? "",
      type: (draft?.company.type || "llc") as CompanyStepValues["type"],
      country: draft?.company.country || "FR",
      city: draft?.company.city ?? "",
      address: draft?.company.address ?? "",
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
        id="company-name"
        label={t("fields.companyName")}
        error={errors.name?.message}
      >
        <Input id="company-name" {...register("name")} />
      </Field>

      <Field
        id="company-type"
        label={t("fields.companyType")}
        error={errors.type?.message}
      >
        <Select id="company-type" {...register("type")}>
          {COMPANY_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        id="company-country"
        label={t("fields.country")}
        error={errors.country?.message}
      >
        <Select id="company-country" {...register("country")}>
          {COUNTRY_CATALOG.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        id="company-city"
        label={t("fields.city")}
        error={errors.city?.message}
      >
        <Input id="company-city" {...register("city")} />
      </Field>

      <Field
        id="company-address"
        label={t("fields.address")}
        error={errors.address?.message}
      >
        <Input id="company-address" {...register("address")} />
      </Field>
    </form>
  );
}
