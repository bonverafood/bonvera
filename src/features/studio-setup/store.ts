"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { SETUP_STEPS, SETUP_STORAGE_KEY } from "./constants";
import { createEmptyDraft, deepMergeDraft } from "./lib/draft";
import type { BrandDraft, SetupPersistState } from "./types";

type SetupActions = {
  ensureDraft: () => string;
  getActiveDraft: () => BrandDraft | null;
  patchDraft: (patch: Parameters<typeof deepMergeDraft>[1]) => void;
  setStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markComplete: () => void;
  setSaveStatus: (status: SetupPersistState["saveStatus"]) => void;
  resetSetup: () => void;
};

export type SetupStore = SetupPersistState & SetupActions;

const lastStepIndex = SETUP_STEPS.length - 1;

export const useSetupStore = create<SetupStore>()(
  persist(
    (set, get) => ({
      activeBrandId: null,
      draftsByBrandId: {},
      currentStepIndex: 0,
      saveStatus: "idle",

      ensureDraft: () => {
        const state = get();
        if (state.activeBrandId && state.draftsByBrandId[state.activeBrandId]) {
          return state.activeBrandId;
        }

        const draft = createEmptyDraft();
        set({
          activeBrandId: draft.brandId,
          draftsByBrandId: {
            ...state.draftsByBrandId,
            [draft.brandId]: draft,
          },
          currentStepIndex: 0,
        });
        return draft.brandId;
      },

      getActiveDraft: () => {
        const { activeBrandId, draftsByBrandId } = get();
        if (!activeBrandId) return null;
        return draftsByBrandId[activeBrandId] ?? null;
      },

      patchDraft: (patch) => {
        const { activeBrandId, draftsByBrandId } = get();
        if (!activeBrandId) return;
        const current = draftsByBrandId[activeBrandId];
        if (!current) return;

        set({
          draftsByBrandId: {
            ...draftsByBrandId,
            [activeBrandId]: deepMergeDraft(current, patch),
          },
        });
      },

      setStepIndex: (index) => {
        const clamped = Math.max(0, Math.min(lastStepIndex, index));
        set({ currentStepIndex: clamped });
      },

      nextStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex < lastStepIndex) {
          set({ currentStepIndex: currentStepIndex + 1 });
        }
      },

      prevStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1 });
        }
      },

      markComplete: () => {
        const { activeBrandId, draftsByBrandId } = get();
        if (!activeBrandId) return;
        const current = draftsByBrandId[activeBrandId];
        if (!current) return;

        set({
          draftsByBrandId: {
            ...draftsByBrandId,
            [activeBrandId]: deepMergeDraft(current, {
              setupCompleted: true,
            }),
          },
        });
      },

      setSaveStatus: (status) => set({ saveStatus: status }),

      resetSetup: () => {
        const draft = createEmptyDraft();
        set({
          activeBrandId: draft.brandId,
          draftsByBrandId: { [draft.brandId]: draft },
          currentStepIndex: 0,
          saveStatus: "idle",
        });
      },
    }),
    {
      name: SETUP_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        activeBrandId: state.activeBrandId,
        draftsByBrandId: state.draftsByBrandId,
        currentStepIndex: state.currentStepIndex,
      }),
    },
  ),
);

export function selectIsSetupCompleted(state: SetupPersistState): boolean {
  const id = state.activeBrandId;
  if (!id) return false;
  return Boolean(state.draftsByBrandId[id]?.setupCompleted);
}
