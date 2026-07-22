"use client";

import Image from "next/image";
import { Copy, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useRef,
  useState,
  useTransition,
  type DragEvent,
} from "react";

import { Button } from "@/components/ui/button";
import type { MediaAsset } from "@/lib/db/schema";
import { useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

import { deleteMedia, uploadMedia } from "../actions";

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

export function MediaLibrary({
  initialItems,
  selectable = false,
  onSelect,
}: MediaLibraryProps) {
  const t = useTranslations("MediaStudio");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  function handleFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setError(null);
    setMessage(null);

    startTransition(async () => {
      for (const file of list) {
        const formData = new FormData();
        formData.set("file", file);
        const result = await uploadMedia(formData);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setItems((prev) => [result.data, ...prev]);
      }
      setMessage(t("uploadSuccess"));
      refresh();
    });
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files?.length) {
      handleFiles(event.dataTransfer.files);
    }
  }

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
          <Button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-4" />
            {t("upload")}
          </Button>
        </header>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "border-border rounded-xl border border-dashed px-6 py-10 text-center transition-colors",
          dragging && "border-primary bg-primary/5",
          selectable && "py-6",
        )}
      >
        <p className="text-sm font-medium">{t("dropTitle")}</p>
        <p className="text-muted-foreground mt-1 text-xs">{t("dropHint")}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
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
