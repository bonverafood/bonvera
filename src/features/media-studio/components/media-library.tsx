"use client";

import Image from "next/image";
import { Copy, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { MediaAsset } from "@/lib/data/types";
import { useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

import { deleteMedia } from "../actions";

type MediaLibraryProps = {
  initialItems: MediaAsset[];
  /** Selection mode for product picker */
  selectable?: boolean;
  onSelect?: (asset: MediaAsset) => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Upload UI is kept as a placeholder — Storage upload is deferred until
 * the production RSC/auth path is stable.
 */
export function MediaLibrary({
  initialItems,
  selectable = false,
  onSelect,
}: MediaLibraryProps) {
  const t = useTranslations("MediaStudio");
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  function onDelete(id: string) {
    if (!window.confirm(t("confirmDelete"))) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteMedia(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      refresh();
    });
  }

  async function onCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage(t("copied"));
    } catch {
      setError(t("copyFailed"));
    }
  }

  return (
    <div className="space-y-6">
      {!selectable ? (
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </div>
          <Button type="button" disabled title={t("uploadDeferred")}>
            <Upload className="size-4" />
            {t("upload")}
          </Button>
        </header>
      ) : null}

      {/* Upload slot — kept for layout; wiring deferred */}
      <div
        aria-disabled="true"
        className={cn(
          "border-border rounded-xl border border-dashed px-6 py-10 text-center opacity-70",
          selectable && "py-6",
        )}
      >
        <p className="text-sm font-medium">{t("dropTitle")}</p>
        <p className="text-muted-foreground mt-1 text-xs">{t("uploadDeferred")}</p>
        <Button type="button" variant="outline" className="mt-4" disabled>
          {t("browse")}
        </Button>
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-muted-foreground text-sm" role="status">
          {message}
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="border-border rounded-xl border px-6 py-16 text-center">
          <p className="font-medium">{t("emptyTitle")}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {t("emptyDescription")}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="border-border bg-card overflow-hidden rounded-xl border"
            >
              <button
                type="button"
                className={cn(
                  "bg-muted relative block aspect-square w-full overflow-hidden",
                  selectable && "cursor-pointer",
                )}
                onClick={() => {
                  if (selectable && onSelect) onSelect(item);
                }}
              >
                <Image
                  src={item.publicUrl}
                  alt={item.altTr ?? item.fileName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  unoptimized
                />
              </button>
              <div className="space-y-2 p-3">
                <p
                  className="truncate text-sm font-medium"
                  title={item.fileName}
                >
                  {item.fileName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatBytes(item.byteSize)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectable ? (
                    <Button
                      type="button"
                      size="sm"
                      className="flex-1"
                      onClick={() => onSelect?.(item)}
                    >
                      {t("select")}
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => void onCopy(item.publicUrl)}
                      >
                        <Copy className="size-3.5" />
                        {t("copyUrl")}
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        disabled={pending}
                        aria-label={t("delete")}
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
