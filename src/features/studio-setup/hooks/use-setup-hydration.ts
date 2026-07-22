"use client";

import { useEffect, useState } from "react";

import { useSetupStore } from "../store";

export function useSetupHydration() {
  const [hydrated, setHydrated] = useState(false);
  const ensureDraft = useSetupStore((state) => state.ensureDraft);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      await useSetupStore.persist.rehydrate();
      if (cancelled) return;
      ensureDraft();
      setHydrated(true);
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [ensureDraft]);

  return hydrated;
}
