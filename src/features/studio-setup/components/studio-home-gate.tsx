"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/i18n/navigation";

import { useSetupHydration } from "../hooks/use-setup-hydration";
import { selectIsSetupCompleted, useSetupStore } from "../store";
import { StudioSurface } from "./studio-surface";

const showReplaySetup = process.env.NODE_ENV === "development";

export function StudioHomeGate() {
  const t = useTranslations("Studio");
  const tSetup = useTranslations("StudioSetup");
  const router = useRouter();
  const hydrated = useSetupHydration();
  const completed = useSetupStore(selectIsSetupCompleted);
  const draft = useSetupStore((state) => state.getActiveDraft());
  const resetSetup = useSetupStore((state) => state.resetSetup);

  useEffect(() => {
    if (!hydrated) return;
    if (!completed) {
      router.replace("/studio/setup");
    }
  }, [hydrated, completed, router]);

  if (!hydrated || !completed) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">{tSetup("loading")}</p>
      </div>
    );
  }

  const brandName = draft?.brand.name?.trim() || t("title");

  return (
    <StudioSurface contentClassName="justify-center gap-6 py-16">
      <main className="space-y-6">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            {tSetup("brandMark")}
          </p>
          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("welcomeBrand", { brand: brandName })}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
        {showReplaySetup ? (
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetSetup();
                router.push("/studio/setup");
              }}
            >
              {t("replaySetup")}
            </Button>
          </div>
        ) : null}
      </main>
    </StudioSurface>
  );
}
