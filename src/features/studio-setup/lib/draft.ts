import { DEFAULT_BRAND_CONTENT_LOCALE } from "../constants";
import type { BrandDraft } from "../types";

export function createEmptyDraft(brandId = crypto.randomUUID()): BrandDraft {
  return {
    brandId,
    setupCompleted: false,
    updatedAt: new Date().toISOString(),
    brand: {
      name: "",
      logoDataUrl: null,
      description: "",
    },
    company: {
      name: "",
      type: "",
      country: "",
      city: "",
      address: "",
    },
    contact: {
      email: "",
      phone: "",
      whatsapp: "",
      website: "",
    },
    social: {
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
    },
    languages: {
      defaultLocale: DEFAULT_BRAND_CONTENT_LOCALE,
      additionalLocales: [],
    },
    hours: {
      opening: "09:00",
      closing: "18:00",
      workingDays: ["mon", "tue", "wed", "thu", "fri"],
    },
  };
}

export function touchDraft(draft: BrandDraft): BrandDraft {
  return {
    ...draft,
    updatedAt: new Date().toISOString(),
  };
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Array<infer U>
      ? Array<U>
      : DeepPartial<T[K]>
    : T[K];
};

export function deepMergeDraft(
  draft: BrandDraft,
  patch: DeepPartial<BrandDraft>,
): BrandDraft {
  const next: BrandDraft = {
    ...draft,
    ...patch,
    brand: { ...draft.brand, ...patch.brand },
    company: { ...draft.company, ...patch.company },
    contact: { ...draft.contact, ...patch.contact },
    social: { ...draft.social, ...patch.social },
    languages: {
      ...draft.languages,
      ...patch.languages,
      additionalLocales:
        patch.languages?.additionalLocales ?? draft.languages.additionalLocales,
    },
    hours: {
      ...draft.hours,
      ...patch.hours,
      workingDays: patch.hours?.workingDays ?? draft.hours.workingDays,
    },
  };

  return touchDraft(next);
}
