export const SETUP_STEP_IDS = [
  "welcome",
  "brand",
  "company",
  "contact",
  "social",
  "languages",
  "hours",
  "finish",
] as const;

export type SetupStepId = (typeof SETUP_STEP_IDS)[number];

export const COMPANY_TYPES = [
  "sole_prop",
  "llc",
  "corporation",
  "nonprofit",
  "other",
] as const;

export type CompanyType = (typeof COMPANY_TYPES)[number];

export const WEEKDAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export type BrandDraft = {
  brandId: string;
  setupCompleted: boolean;
  updatedAt: string;
  brand: {
    name: string;
    logoDataUrl: string | null;
    description: string;
  };
  company: {
    name: string;
    type: CompanyType | "";
    country: string;
    city: string;
    address: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    website: string;
  };
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  languages: {
    defaultLocale: string;
    additionalLocales: string[];
  };
  hours: {
    opening: string;
    closing: string;
    workingDays: Weekday[];
  };
};

export type SetupPersistState = {
  activeBrandId: string | null;
  draftsByBrandId: Record<string, BrandDraft>;
  currentStepIndex: number;
  saveStatus: "idle" | "saving" | "saved";
};
