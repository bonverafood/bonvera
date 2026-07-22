import type { CompanyType, SetupStepId, Weekday } from "./types";

export const SETUP_STORAGE_KEY = "studio-os:setup-draft";

/**
 * Default brand *content* locale (independent from app UI locales in `@/config/i18n`).
 * Bonvera / Studio MVP defaults to French.
 */
export const DEFAULT_BRAND_CONTENT_LOCALE = "fr";

export const SETUP_STEPS: ReadonlyArray<{
  id: SetupStepId;
  titleKey: string;
  descriptionKey: string;
}> = [
  {
    id: "welcome",
    titleKey: "steps.welcome.title",
    descriptionKey: "steps.welcome.description",
  },
  {
    id: "brand",
    titleKey: "steps.brand.title",
    descriptionKey: "steps.brand.description",
  },
  {
    id: "company",
    titleKey: "steps.company.title",
    descriptionKey: "steps.company.description",
  },
  {
    id: "contact",
    titleKey: "steps.contact.title",
    descriptionKey: "steps.contact.description",
  },
  {
    id: "social",
    titleKey: "steps.social.title",
    descriptionKey: "steps.social.description",
  },
  {
    id: "languages",
    titleKey: "steps.languages.title",
    descriptionKey: "steps.languages.description",
  },
  {
    id: "hours",
    titleKey: "steps.hours.title",
    descriptionKey: "steps.hours.description",
  },
  {
    id: "finish",
    titleKey: "steps.finish.title",
    descriptionKey: "steps.finish.description",
  },
] as const;

export const COMPANY_TYPE_OPTIONS: ReadonlyArray<{
  value: CompanyType;
  labelKey: string;
}> = [
  { value: "sole_prop", labelKey: "companyTypes.sole_prop" },
  { value: "llc", labelKey: "companyTypes.llc" },
  { value: "corporation", labelKey: "companyTypes.corporation" },
  { value: "nonprofit", labelKey: "companyTypes.nonprofit" },
  { value: "other", labelKey: "companyTypes.other" },
];

export const WEEKDAY_OPTIONS: ReadonlyArray<{
  value: Weekday;
  labelKey: string;
}> = [
  { value: "mon", labelKey: "weekdays.mon" },
  { value: "tue", labelKey: "weekdays.tue" },
  { value: "wed", labelKey: "weekdays.wed" },
  { value: "thu", labelKey: "weekdays.thu" },
  { value: "fri", labelKey: "weekdays.fri" },
  { value: "sat", labelKey: "weekdays.sat" },
  { value: "sun", labelKey: "weekdays.sun" },
];

export type LanguageOption = { code: string; name: string };
export type CountryOption = { code: string; name: string };

/** Brand content languages — independent from app UI locales. */
export const LANGUAGE_CATALOG: ReadonlyArray<LanguageOption> = [
  { code: "af", name: "Afrikaans" },
  { code: "ar", name: "Arabic" },
  { code: "az", name: "Azerbaijani" },
  { code: "bg", name: "Bulgarian" },
  { code: "bn", name: "Bengali" },
  { code: "ca", name: "Catalan" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "et", name: "Estonian" },
  { code: "fa", name: "Persian" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hr", name: "Croatian" },
  { code: "hu", name: "Hungarian" },
  { code: "hy", name: "Armenian" },
  { code: "id", name: "Indonesian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ka", name: "Georgian" },
  { code: "kk", name: "Kazakh" },
  { code: "ko", name: "Korean" },
  { code: "lt", name: "Lithuanian" },
  { code: "lv", name: "Latvian" },
  { code: "mk", name: "Macedonian" },
  { code: "ms", name: "Malay" },
  { code: "nl", name: "Dutch" },
  { code: "no", name: "Norwegian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "sq", name: "Albanian" },
  { code: "sr", name: "Serbian" },
  { code: "sv", name: "Swedish" },
  { code: "sw", name: "Swahili" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "uz", name: "Uzbek" },
  { code: "vi", name: "Vietnamese" },
  { code: "zh", name: "Chinese" },
  { code: "zh-Hans", name: "Chinese (Simplified)" },
  { code: "zh-Hant", name: "Chinese (Traditional)" },
];

export const COUNTRY_CATALOG: ReadonlyArray<CountryOption> = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BR", name: "Brazil" },
  { code: "BG", name: "Bulgaria" },
  { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KW", name: "Kuwait" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MY", name: "Malaysia" },
  { code: "MX", name: "Mexico" },
  { code: "MA", name: "Morocco" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NG", name: "Nigeria" },
  { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PS", name: "Palestine" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "RS", name: "Serbia" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VN", name: "Vietnam" },
  { code: "OTHER", name: "Other" },
];

export function getLanguageName(code: string): string {
  return LANGUAGE_CATALOG.find((item) => item.code === code)?.name ?? code;
}

export function getCountryName(code: string): string {
  return COUNTRY_CATALOG.find((item) => item.code === code)?.name ?? code;
}
