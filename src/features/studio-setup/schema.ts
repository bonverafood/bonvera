import { z } from "zod";

import { COMPANY_TYPES, WEEKDAYS } from "./types";

export type SetupErrorTranslate = (
  key: string,
  values?: Record<string, string | number | Date>,
) => string;

const optionalUrl = (t: SetupErrorTranslate) =>
  z.union([z.literal(""), z.url({ error: t("errors.invalidUrl") })]);

const optionalHandleOrUrl = z.string().max(200);

export function createBrandStepSchema(t: SetupErrorTranslate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t("errors.nameMin"))
      .max(80, t("errors.nameMax")),
    logoDataUrl: z.string().nullable(),
    description: z.string().max(500, t("errors.descriptionMax")),
  });
}

export function createCompanyStepSchema(t: SetupErrorTranslate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t("errors.nameMin"))
      .max(120, t("errors.nameMax")),
    type: z.enum(COMPANY_TYPES, {
      error: t("errors.companyTypeRequired"),
    }),
    country: z.string().min(1, t("errors.countryRequired")),
    city: z.string().max(80, t("errors.cityMax")),
    address: z.string().max(200, t("errors.addressMax")),
  });
}

export function createContactStepSchema(t: SetupErrorTranslate) {
  return z.object({
    email: z.email({ error: t("errors.invalidEmail") }),
    phone: z.string().max(40, t("errors.phoneMax")),
    whatsapp: z.string().max(40, t("errors.phoneMax")),
    website: optionalUrl(t),
  });
}

export function createSocialStepSchema() {
  return z.object({
    instagram: optionalHandleOrUrl,
    facebook: optionalHandleOrUrl,
    linkedin: optionalHandleOrUrl,
    youtube: optionalHandleOrUrl,
    tiktok: optionalHandleOrUrl,
  });
}

export function createLanguagesStepSchema(t: SetupErrorTranslate) {
  return z
    .object({
      defaultLocale: z.string().min(1, t("errors.defaultLanguageRequired")),
      additionalLocales: z.array(z.string()),
    })
    .superRefine((value, ctx) => {
      const unique = new Set(value.additionalLocales);
      if (unique.size !== value.additionalLocales.length) {
        ctx.addIssue({
          code: "custom",
          path: ["additionalLocales"],
          message: t("errors.duplicateLanguages"),
        });
      }
      if (value.additionalLocales.includes(value.defaultLocale)) {
        ctx.addIssue({
          code: "custom",
          path: ["additionalLocales"],
          message: t("errors.additionalIncludesDefault"),
        });
      }
    });
}

export function createHoursStepSchema(t: SetupErrorTranslate) {
  return z
    .object({
      opening: z.string().regex(/^\d{2}:\d{2}$/, t("errors.invalidTime")),
      closing: z.string().regex(/^\d{2}:\d{2}$/, t("errors.invalidTime")),
      workingDays: z.array(z.enum(WEEKDAYS)).min(1, t("errors.workingDaysMin")),
    })
    .superRefine((value, ctx) => {
      if (value.closing <= value.opening) {
        ctx.addIssue({
          code: "custom",
          path: ["closing"],
          message: t("errors.closingAfterOpening"),
        });
      }
    });
}

export function createFullBrandDraftSchema(t: SetupErrorTranslate) {
  return z.object({
    brandId: z.string().uuid(),
    setupCompleted: z.boolean(),
    updatedAt: z.string(),
    brand: createBrandStepSchema(t),
    company: createCompanyStepSchema(t),
    contact: createContactStepSchema(t),
    social: createSocialStepSchema(),
    languages: createLanguagesStepSchema(t),
    hours: createHoursStepSchema(t),
  });
}

/** Static schemas for typing / non-UI use (English fallbacks). */
const passthrough: SetupErrorTranslate = (key) => key;

export const brandStepSchema = createBrandStepSchema(passthrough);
export const companyStepSchema = createCompanyStepSchema(passthrough);
export const contactStepSchema = createContactStepSchema(passthrough);
export const socialStepSchema = createSocialStepSchema();
export const languagesStepSchema = createLanguagesStepSchema(passthrough);
export const hoursStepSchema = createHoursStepSchema(passthrough);
export const fullBrandDraftSchema = createFullBrandDraftSchema(passthrough);

export type BrandStepValues = z.infer<typeof brandStepSchema>;
export type CompanyStepValues = z.infer<typeof companyStepSchema>;
export type ContactStepValues = z.infer<typeof contactStepSchema>;
export type SocialStepValues = z.infer<typeof socialStepSchema>;
export type LanguagesStepValues = z.infer<typeof languagesStepSchema>;
export type HoursStepValues = z.infer<typeof hoursStepSchema>;
export type FullBrandDraftValues = z.infer<typeof fullBrandDraftSchema>;
