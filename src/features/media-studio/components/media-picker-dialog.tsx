"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { MediaAsset } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import { listMedia } from "../actions";
import { MediaLibrary } from "./media-library";

type MediaPickerDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
};

export function MediaPickerDialog({
  open,
  onClose,
  onSelect,
}: MediaPickerDialogProps) {
  const t = useTranslations("MediaStudio");
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setError(null);
    startTransition(async () => {
      const result = await listMedia();
      if (!result.ok) {
        setError(result.error);
        setItems([]);
        return;
      }
      setItems(result.data);
    });
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="bg-foreground/40 absolute inset-0"
        aria-label={t("closePicker")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("pickerTitle")}
        className={cn(
          "border-border bg-background relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border shadow-lg sm:rounded-2xl",
        )}
      >
        <div className="border-border flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold">{t("pickerTitle")}</h2>
            <p className="text-muted-foreground text-xs">{t("pickerHint")}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {t("closePicker")}
          </Button>
        </div>
        <div className="overflow-y-auto px-4 py-4 sm:px-6">
          {pending && items.length === 0 && !error ? (
            <p className="text-muted-foreground text-sm">{t("loading")}</p>
          ) : null}
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : (
            <MediaLibrary
              key={items.map((i) => i.id).join(",") || "empty"}
              initialItems={items}
              selectable
              onSelect={(asset) => {
                onSelect(asset.publicUrl);
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
