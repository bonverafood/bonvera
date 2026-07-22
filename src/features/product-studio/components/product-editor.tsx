"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MediaPickerDialog } from "@/features/media-studio/components/media-picker-dialog";
import { useRouter } from "@/lib/i18n/navigation";
import type { Product } from "@/lib/data/types";

import { createProduct, updateProduct, archiveProduct } from "../actions";
import { productInputSchema, type ProductInput } from "../schema";
import { ProductLivePreview } from "./product-live-preview";

type ProductEditorProps = {
  mode: "create" | "edit";
  product?: Product;
};

function toFormValues(product?: Product): ProductInput {
  if (!product) {
    return {
      slug: "",
      status: "draft",
      nameTr: "",
      summaryTr: "",
      bodyTr: "",
      imageUrl: "",
      seoTitleTr: "",
      seoDescriptionTr: "",
      ogImageUrl: "",
      sortOrder: 0,
    };
  }
  return {
    slug: product.slug,
    status: product.status,
    nameTr: product.nameTr,
    summaryTr: product.summaryTr ?? "",
    bodyTr: product.bodyTr ?? "",
    imageUrl: product.imageUrl ?? "",
    seoTitleTr: product.seoTitleTr ?? "",
    seoDescriptionTr: product.seoDescriptionTr ?? "",
    ogImageUrl: product.ogImageUrl ?? "",
    sortOrder: product.sortOrder,
  };
}

export function ProductEditor({ mode, product }: ProductEditorProps) {
  const t = useTranslations("ProductStudio");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: toFormValues(product),
    mode: "onChange",
  });

  const values = form.watch();

  useEffect(() => {
    if (saveState !== "saved") return;
    const id = window.setTimeout(() => setSaveState("idle"), 2000);
    return () => window.clearTimeout(id);
  }, [saveState]);

  function onSubmit(data: ProductInput) {
    setError(null);
    setSaveState("saving");
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProduct(data)
          : await updateProduct(product!.id, data);

      if (!result.ok) {
        setError(result.error);
        setSaveState("error");
        return;
      }

      setSaveState("saved");
      if (mode === "create") {
        router.replace(`/studio/urunler/${result.data.id}`);
        router.refresh();
        return;
      }
      router.refresh();
    });
  }

  function onArchive() {
    if (!product || mode !== "edit") return;
    if (!window.confirm(t("confirmArchive"))) return;
    startTransition(async () => {
      const result = await archiveProduct(product.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace("/studio/urunler");
      router.refresh();
    });
  }

  function slugifyFromName() {
    const name = form.getValues("nameTr");
    const slug = name
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    form.setValue("slug", slug, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {mode === "create" ? t("createTitle") : t("editTitle")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("editorHint")}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              {saveState === "saving"
                ? t("saving")
                : saveState === "saved"
                  ? t("saved")
                  : null}
            </span>
            <Button type="submit" disabled={pending}>
              {t("save")}
            </Button>
          </div>
        </div>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <section className="border-border space-y-4 rounded-xl border p-4 sm:p-5">
          <h2 className="text-sm font-semibold">{t("sections.content")}</h2>
          <div className="space-y-2">
            <Label htmlFor="nameTr">{t("fields.name")}</Label>
            <Input id="nameTr" {...form.register("nameTr")} />
            {form.formState.errors.nameTr ? (
              <p className="text-destructive text-xs">
                {form.formState.errors.nameTr.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="slug">{t("fields.slug")}</Label>
              <Input id="slug" {...form.register("slug")} />
              {form.formState.errors.slug ? (
                <p className="text-destructive text-xs">
                  {form.formState.errors.slug.message}
                </p>
              ) : null}
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={slugifyFromName}
                className="w-full sm:w-auto"
              >
                {t("slugFromName")}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summaryTr">{t("fields.summary")}</Label>
            <Textarea id="summaryTr" rows={3} {...form.register("summaryTr")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyTr">{t("fields.body")}</Label>
            <Textarea id="bodyTr" rows={8} {...form.register("bodyTr")} />
          </div>
        </section>

        <section className="border-border space-y-4 rounded-xl border p-4 sm:p-5">
          <h2 className="text-sm font-semibold">{t("sections.media")}</h2>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">{t("fields.imageUrl")}</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="imageUrl"
                placeholder="/brand/product-icli-kofte.jpg"
                className="flex-1"
                {...form.register("imageUrl")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setPickerOpen(true)}
              >
                {t("pickFromMedia")}
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">{t("imageHint")}</p>
          </div>
        </section>

        <section className="border-border space-y-4 rounded-xl border p-4 sm:p-5">
          <h2 className="text-sm font-semibold">{t("sections.seo")}</h2>
          <div className="space-y-2">
            <Label htmlFor="seoTitleTr">{t("fields.seoTitle")}</Label>
            <Input id="seoTitleTr" {...form.register("seoTitleTr")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescriptionTr">
              {t("fields.seoDescription")}
            </Label>
            <Textarea
              id="seoDescriptionTr"
              rows={3}
              {...form.register("seoDescriptionTr")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogImageUrl">{t("fields.ogImage")}</Label>
            <Input id="ogImageUrl" {...form.register("ogImageUrl")} />
          </div>
        </section>

        <section className="border-border space-y-4 rounded-xl border p-4 sm:p-5">
          <h2 className="text-sm font-semibold">{t("sections.publish")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">{t("fields.status")}</Label>
              <Select id="status" {...form.register("status")}>
                <option value="draft">{t("status.draft")}</option>
                <option value="published">{t("status.published")}</option>
                <option value="archived">{t("status.archived")}</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">{t("fields.sortOrder")}</Label>
              <Input
                id="sortOrder"
                type="number"
                min={0}
                {...form.register("sortOrder", { valueAsNumber: true })}
              />
            </div>
          </div>
        </section>

        {mode === "edit" ? (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={onArchive}
            >
              {t("archive")}
            </Button>
          </div>
        ) : null}
      </form>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.14em] uppercase">
          {t("preview")}
        </p>
        <ProductLivePreview
          nameTr={values.nameTr ?? ""}
          summaryTr={values.summaryTr ?? ""}
          bodyTr={values.bodyTr ?? ""}
          imageUrl={values.imageUrl}
          slug={values.slug ?? ""}
          status={values.status ?? "draft"}
        />
      </aside>

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          form.setValue("imageUrl", url, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </div>
  );
}
