import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale } from "@/config/i18n";
import { routing } from "@/lib/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
