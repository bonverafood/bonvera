"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSeoDefaults } from "@/lib/data/types";

import { saveSiteDefaults } from "../actions";
import {
  siteSeoDefaultsSchema,
  type SiteSeoDefaultsInput,
} from "../schema";

type SiteDefaultsFormProps = {
  defaults: SiteSeoDefaults;
};

function toValues(defaults: SiteSeoDefaults): SiteSeoDefaultsInput {
  return {
    titleSuffixTr: defaults.titleSuffixTr,
    defaultDescriptionTr: defaults.defaultDescriptionTr,
    defaultOgImageUrl: defaults.defaultOgImageUrl ?? "",
    organizationNameTr: defaults.organizationNameTr,
    organizationDescriptionTr: defaults.organizationDescriptionTr,
  };
}

export function SiteDefaultsForm({ defaults }: SiteDefaultsFormProps) {
  const t = useTranslations("SeoStudio");
  const [pending, startTransition] = useTransition();
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SiteSeoDefaultsInput>({
    resolver: zodResolver(siteSeoDefaultsSchema),
    defaultValues: toValues(defaults),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(toValues(defaults));
  }, [defaults, form]);

  useEffect(() => {
    if (saveState !== "saved") return;
    const id = window.setTimeout(() => setSaveState("idle"), 2000);
    return () => window.clearTimeout(id);
  }, [saveState]);

  function onSubmit(data: SiteSeoDefaultsInput) {
    setError(null);
    setSaveState("saving");
    startTransition(async () => {
      const result = await saveSiteDefaults(data);
      if (!result.ok) {
        setError(result.error);
        setSaveState("error");
        return;
      }
      setSaveState("saved");
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-4 sm:p-5"
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          {t("defaults.title")}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("defaults.description")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="organizationNameTr">{t("fields.orgName")}</Label>
          <Input id="organizationNameTr" {...form.register("organizationNameTr")} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="organizationDescriptionTr">
            {t("fields.orgDescription")}
          </Label>
          <Textarea
            id="organizationDescriptionTr"
            rows={2}
            {...form.register("organizationDescriptionTr")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="titleSuffixTr">{t("fields.titleSuffix")}</Label>
          <Input id="titleSuffixTr" {...form.register("titleSuffixTr")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="defaultOgImageUrl">{t("fields.defaultOg")}</Label>
          <Input
            id="defaultOgImageUrl"
            {...form.register("defaultOgImageUrl")}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="defaultDescriptionTr">
            {t("fields.defaultDescription")}
          </Label>
          <Textarea
            id="defaultDescriptionTr"
            rows={3}
            {...form.register("defaultDescriptionTr")}
          />
        </div>
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
        {saveState === "saved" ? (
          <span className="text-muted-foreground text-sm">{t("saved")}</span>
        ) : null}
      </div>
    </form>
  );
}
