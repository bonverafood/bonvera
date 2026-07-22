"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type StudioErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function StudioAppError({ error, reset }: StudioErrorProps) {
  const [debugBody, setDebugBody] = useState<string | null>(null);

  useEffect(() => {
    console.error("[studio]", error);
  }, [error]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/studio-debug", { cache: "no-store" });
        const text = await res.text();
        if (!cancelled) setDebugBody(text);
      } catch (fetchError) {
        if (!cancelled) {
          setDebugBody(
            fetchError instanceof Error
              ? fetchError.message
              : "studio-debug fetch failed",
          );
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Studio hatasi</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Production ortaminda Next.js hata metnini gizler. Asagidaki digest ve
        debug JSON&apos;u paylas; Vercel Function Logs&apos;ta ayni digest ile
        gercek mesaj yazar.
      </p>
      <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap">
        {error.message}
        {error.digest ? `\nDigest: ${error.digest}` : "\nDigest: (yok)"}
      </pre>
      <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap">
        {debugBody ?? "studio-debug yukleniyor…"}
      </pre>
      <p className="text-sm">
        <a
          className="underline underline-offset-4"
          href="/api/studio-health"
          target="_blank"
          rel="noreferrer"
        >
          /api/studio-health
        </a>
        {" · "}
        <a
          className="underline underline-offset-4"
          href="/api/studio-debug"
          target="_blank"
          rel="noreferrer"
        >
          /api/studio-debug
        </a>
      </p>
      <div>
        <Button type="button" onClick={() => reset()}>
          Tekrar dene
        </Button>
      </div>
    </div>
  );
}
