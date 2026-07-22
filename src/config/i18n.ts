/**
 * Locale registry — single source of truth for internationalization.
 *
 * App routing default/fallback come from env (`NEXT_PUBLIC_DEFAULT_LOCALE`,
 * `NEXT_PUBLIC_FALLBACK_LOCALE`). Studio Admin UI is Turkish.
 *
 * Brand *content* source language is separate (Brand Engine: Turkish source).
 * Public customer locales (e.g. Bonvera FR) come later via Translation Engine.
 *
 * To add a language:
 * 1. Append the locale code to `locales`
 * 2. Add `src/messages/<locale>.json`
 * 3. Restart the app
 */

import { publicEnv } from "@/config/env";

export const locales = ["tr", "fr"] as const;

export type Locale = (typeof locales)[number];

function resolveLocale(value: string, fallback: Locale): Locale {
  return (locales as readonly string[]).includes(value)
    ? (value as Locale)
    : fallback;
}

/** Unprefixed routes use this locale (`localePrefix: 'as-needed'`). */
export const defaultLocale: Locale = resolveLocale(
  publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE,
  "tr",
);

/** Message / negotiation fallback when a locale or key is missing. */
export const fallbackLocale: Locale = resolveLocale(
  publicEnv.NEXT_PUBLIC_FALLBACK_LOCALE,
  defaultLocale,
);

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  fr: "Français",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
