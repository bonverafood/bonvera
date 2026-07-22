/**
 * Locale registry — single source of truth for internationalization.
 *
 * Public site: French is the default (unprefixed URLs). Turkish is `/tr/…`.
 * Studio Admin UI is always Turkish (`studioUiLocale`), regardless of the
 * public default.
 *
 * Brand *content* source language is separate (Brand Engine: Turkish source).
 *
 * To add a language:
 * 1. Append the locale code to `locales`
 * 2. Add `src/messages/<locale>.json`
 * 3. Restart the app
 */

import { publicEnv } from "@/config/env";

/** Public locales — primary first (switcher / listing order). */
export const locales = ["fr", "tr"] as const;

export type Locale = (typeof locales)[number];

/** Studio Admin UI language — fixed; no admin language switcher. */
export const studioUiLocale: Locale = "tr";

function resolveLocale(value: string, fallback: Locale): Locale {
  return (locales as readonly string[]).includes(value)
    ? (value as Locale)
    : fallback;
}

/** Unprefixed routes use this locale (`localePrefix: 'as-needed'`). */
export const defaultLocale: Locale = resolveLocale(
  publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE,
  "fr",
);

/** Message / negotiation fallback when a locale or key is missing. */
export const fallbackLocale: Locale = resolveLocale(
  publicEnv.NEXT_PUBLIC_FALLBACK_LOCALE,
  defaultLocale,
);

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  tr: "Türkçe",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
