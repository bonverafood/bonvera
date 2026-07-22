import { defaultLocale, locales } from "@/config/i18n";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});
