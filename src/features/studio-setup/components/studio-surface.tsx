"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StudioSurfaceProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/** Shared calm Studio background shell (setup + home). */
export function StudioSurface({
  children,
  className,
  contentClassName,
}: StudioSurfaceProps) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.97_0.01_250)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_oklch(0.96_0.02_165)_0%,_transparent_45%)]"
      />
      <div
        className={cn(
          "relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-6 py-10 sm:py-16",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
