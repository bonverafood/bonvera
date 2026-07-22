"use client";

import Image from "next/image";

type ProductPreviewProps = {
  nameTr: string;
  summaryTr: string;
  bodyTr: string;
  imageUrl: string | null | undefined;
  slug: string;
  status: string;
};

export function ProductLivePreview({
  nameTr,
  summaryTr,
  bodyTr,
  imageUrl,
  slug,
  status,
}: ProductPreviewProps) {
  const src =
    imageUrl && imageUrl.length > 0
      ? imageUrl
      : "/brand/product-icli-kofte.jpg";

  return (
    <div
      data-surface="marketing"
      className="bg-background text-foreground flex h-full min-h-[28rem] flex-col overflow-hidden rounded-xl border border-[oklch(0.88_0.012_75)]"
    >
      <div className="relative min-h-52 flex-1 overflow-hidden bg-[oklch(0.16_0.02_250)]">
        {src.startsWith("/") || src.startsWith("http") ? (
          <Image
            src={src}
            alt=""
            fill
            className="object-cover object-[28%_center] opacity-85"
            sizes="(max-width: 1024px) 100vw, 40vw"
            unoptimized={src.startsWith("http")}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,24,0.2)_0%,rgba(12,16,24,0.75)_100%)]" />
        <div className="relative flex h-full min-h-52 flex-col justify-end p-6 text-white">
          <p className="mb-1 text-[10px] tracking-[0.16em] text-white/60 uppercase">
            bonvera.food/{slug || "…"}
          </p>
          <h2 className="font-display text-3xl leading-tight">
            {nameTr || "Urun adi"}
          </h2>
        </div>
      </div>
      <div className="space-y-3 p-6">
        <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
          {status}
        </p>
        <p className="text-sm leading-relaxed">
          {summaryTr || "Kisa ozet burada gorunecek."}
        </p>
        {bodyTr ? (
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {bodyTr}
          </p>
        ) : null}
      </div>
    </div>
  );
}
