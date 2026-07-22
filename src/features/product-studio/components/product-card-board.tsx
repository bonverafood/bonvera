"use client";

import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/data/types";
import { cn } from "@/lib/utils";

import { archiveProduct } from "../actions";
import { ProductEditor } from "./product-editor";

type ProductCardBoardProps = {
  initialItems: Product[];
};

export function ProductCardBoard({ initialItems }: ProductCardBoardProps) {
  const t = useTranslations("ProductStudio");
  const [items, setItems] = useState(initialItems);
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const openProduct = useMemo(
    () => items.find((item) => item.id === openId) ?? null,
    [items, openId],
  );

  function toggleEdit(id: string) {
    setCreating(false);
    setOpenId((current) => (current === id ? null : id));
  }

  function onDelete(id: string) {
    if (!window.confirm(t("confirmArchive"))) return;
    setError(null);
    startTransition(async () => {
      const result = await archiveProduct(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (openId === id) setOpenId(null);
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("listTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("listDescription")}</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setOpenId(null);
            setCreating((v) => !v);
          }}
        >
          <Plus className="size-4" />
          {t("newProduct")}
        </Button>
      </header>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {creating ? (
        <div className="border-border bg-card rounded-2xl border p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">{t("createTitle")}</h2>
          <ProductEditor
            mode="create"
            embedded
            onCancel={() => setCreating(false)}
            onSaved={() => {
              setCreating(false);
            }}
          />
        </div>
      ) : null}

      {items.length === 0 && !creating ? (
        <div className="border-border rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">{t("emptyTitle")}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {t("emptyDescription")}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => {
            const isOpen = openId === product.id;
            return (
              <li
                key={product.id}
                className={cn(
                  "border-border bg-card overflow-hidden rounded-2xl border",
                  isOpen && "sm:col-span-2 xl:col-span-3",
                )}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="bg-muted relative aspect-[4/3] w-full shrink-0 sm:aspect-square sm:w-40 md:w-48">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.nameTr}
                        fill
                        className="object-cover object-[28%_center]"
                        sizes="(max-width: 640px) 100vw, 192px"
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold">
                          {product.nameTr}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          /{product.slug}
                        </p>
                        <span
                          className={cn(
                            "mt-2 inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                            product.status === "published" &&
                              "bg-primary/10 text-primary",
                            product.status === "draft" &&
                              "bg-muted text-muted-foreground",
                            product.status === "archived" &&
                              "bg-destructive/10 text-destructive",
                          )}
                        >
                          {t(`status.${product.status}`)}
                        </span>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant={isOpen ? "secondary" : "ghost"}
                          aria-label={t("edit")}
                          aria-expanded={isOpen}
                          onClick={() => toggleEdit(product.id)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          disabled={pending}
                          aria-label={t("delete")}
                          onClick={() => onDelete(product.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    {product.summaryTr ? (
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                        {product.summaryTr}
                      </p>
                    ) : null}
                  </div>
                </div>

                {isOpen && openProduct ? (
                  <div className="border-border border-t p-4 sm:p-6">
                    <ProductEditor
                      key={openProduct.id}
                      mode="edit"
                      product={openProduct}
                      embedded
                      onCancel={() => setOpenId(null)}
                      onSaved={() => setOpenId(null)}
                      onArchived={(id) => {
                        setItems((prev) => prev.filter((item) => item.id !== id));
                        setOpenId(null);
                      }}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
