"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSeoPage, SiteSeoPageKey } from "@/lib/data";

import { savePageSeo } from "../actions";
import { siteSeoPageSchema, type SiteSeoPageInput } from "../schema";

type PageSeoFormProps = {
  page: SiteSeoPage;
};

function toValues(page: SiteSeoPage): SiteSeoPageInput {
  return {
    pageKey: page.pageKey,
    titleTr: page.titleTr ?? "",
    descriptionTr: page.descriptionTr ?? "",
    ogImageUrl: page.ogImageUrl ?? "",
  };
}

export function PageSeoForm({ page }: PageSeoFormProps) {
  const t = useTranslations("SeoStudio");
  const [pending, startTransition] = useTransition();
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SiteSeoPageInput>({
    resolver: zodResolver(siteSeoPageSchema),
    defaultValues: toValues(page),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(toValues(page));
  }, [page, form]);

  useEffect(() => {
    if (saveState !== "saved") return;
    const id = window.setTimeout(() => setSaveState("idle"), 2000);
    return () => window.clearTimeout(id);
  }, [saveState]);

  function onSubmit(data: SiteSeoPageInput) {
    setError(null);
    setSaveState("saving");
    startTransition(async () => {
      const result = await savePageSeo(data);
      if (!result.ok) {
        setError(result.error);
        setSaveState("error");
        return;
      }
      setSaveState("saved");
    });
  }

  const pageKey = page.pageKey as SiteSeoPageKey;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-3 rounded-lg border border-border/70 bg-card/40 p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-medium">{t(`pages.keys.${pageKey}`)}</h3>
          <p className="text-muted-foreground font-mono text-xs">{page.path}</p>
        </div>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
      </div>

      <input type="hidden" {...form.register("pageKey")} />

      <div className="space-y-2">
        <Label htmlFor={`title-${page.id}`}>{t("fields.pageTitle")}</Label>
        <Input id={`title-${page.id}`} {...form.register("titleTr")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`desc-${page.id}`}>{t("fields.pageDescription")}</Label>
        <Textarea
          id={`desc-${page.id}`}
          rows={2}
          {...form.register("descriptionTr")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`og-${page.id}`}>{t("fields.pageOg")}</Label>
        <Input id={`og-${page.id}`} {...form.register("ogImageUrl")} />
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {saveState === "saved" ? (
        <p className="text-muted-foreground text-sm">{t("saved")}</p>
      ) : null}
    </form>
  );
}
