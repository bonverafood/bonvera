"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type StudioErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Surfaces the real server error in Studio instead of the opaque Vercel digest page.
 */
export default function StudioAppError({ error, reset }: StudioErrorProps) {
  useEffect(() => {
    console.error("[studio]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Studio hatasi</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Sayfa yuklenirken bir sunucu hatasi olustu. Asagidaki mesaj Vercel
        loglarindaki hatayla ayni kaynagi gosterir.
      </p>
      <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap">
        {error.message || "Bilinmeyen hata"}
        {error.digest ? `\nDigest: ${error.digest}` : ""}
      </pre>
      <div>
        <Button type="button" onClick={() => reset()}>
          Tekrar dene
        </Button>
      </div>
    </div>
  );
}
