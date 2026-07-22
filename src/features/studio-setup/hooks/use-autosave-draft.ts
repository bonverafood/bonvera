"use client";

import { useCallback, useEffect, useRef } from "react";

import { useSetupStore } from "../store";
import type { BrandDraft } from "../types";

type DraftPatch = Parameters<
  ReturnType<typeof useSetupStore.getState>["patchDraft"]
>[0];

const AUTOSAVE_MS = 350;

function mergePatches(base: DraftPatch | null, next: DraftPatch): DraftPatch {
  if (!base) return next;
  return {
    ...base,
    ...next,
    brand: next.brand ? { ...base.brand, ...next.brand } : base.brand,
    company: next.company ? { ...base.company, ...next.company } : base.company,
    contact: next.contact ? { ...base.contact, ...next.contact } : base.contact,
    social: next.social ? { ...base.social, ...next.social } : base.social,
    languages: next.languages
      ? {
          ...base.languages,
          ...next.languages,
          additionalLocales:
            next.languages.additionalLocales ??
            base.languages?.additionalLocales,
        }
      : base.languages,
    hours: next.hours
      ? {
          ...base.hours,
          ...next.hours,
          workingDays: next.hours.workingDays ?? base.hours?.workingDays,
        }
      : base.hours,
  };
}

export function useAutosaveDraft() {
  const patchDraft = useSetupStore((state) => state.patchDraft);
  const setSaveStatus = useSetupStore((state) => state.setSaveStatus);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<DraftPatch | null>(null);

  const applyPending = useCallback(() => {
    if (!pendingRef.current) return;
    patchDraft(pendingRef.current);
    pendingRef.current = null;
    setSaveStatus("saved");
  }, [patchDraft, setSaveStatus]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // Flush on unmount so navigating away does not drop the last edits.
      if (pendingRef.current) {
        useSetupStore.getState().patchDraft(pendingRef.current);
        pendingRef.current = null;
      }
    };
  }, []);

  const scheduleSave = useCallback(
    (patch: DraftPatch) => {
      pendingRef.current = mergePatches(pendingRef.current, patch);
      setSaveStatus("saving");
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        applyPending();
      }, AUTOSAVE_MS);
    },
    [applyPending, setSaveStatus],
  );

  /** Immediate persist — call before advancing steps so the next form reads fresh draft. */
  const commitSave = useCallback(
    (patch: DraftPatch) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      pendingRef.current = mergePatches(pendingRef.current, patch);
      applyPending();
    },
    [applyPending],
  );

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    applyPending();
  }, [applyPending]);

  const saveBrand = useCallback(
    (values: BrandDraft["brand"], immediate = false) => {
      const patch = { brand: values };
      if (immediate) commitSave(patch);
      else scheduleSave(patch);
    },
    [commitSave, scheduleSave],
  );

  const saveCompany = useCallback(
    (values: BrandDraft["company"], immediate = false) => {
      const patch = { company: values };
      if (immediate) commitSave(patch);
      else scheduleSave(patch);
    },
    [commitSave, scheduleSave],
  );

  const saveContact = useCallback(
    (values: BrandDraft["contact"], immediate = false) => {
      const patch = { contact: values };
      if (immediate) commitSave(patch);
      else scheduleSave(patch);
    },
    [commitSave, scheduleSave],
  );

  const saveSocial = useCallback(
    (values: BrandDraft["social"], immediate = false) => {
      const patch = { social: values };
      if (immediate) commitSave(patch);
      else scheduleSave(patch);
    },
    [commitSave, scheduleSave],
  );

  const saveLanguages = useCallback(
    (values: BrandDraft["languages"], immediate = false) => {
      const patch = { languages: values };
      if (immediate) commitSave(patch);
      else scheduleSave(patch);
    },
    [commitSave, scheduleSave],
  );

  const saveHours = useCallback(
    (values: BrandDraft["hours"], immediate = false) => {
      const patch = { hours: values };
      if (immediate) commitSave(patch);
      else scheduleSave(patch);
    },
    [commitSave, scheduleSave],
  );

  return {
    scheduleSave,
    commitSave,
    flush,
    saveBrand,
    saveCompany,
    saveContact,
    saveSocial,
    saveLanguages,
    saveHours,
  };
}
