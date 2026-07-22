import {
  APP_SURFACE_HEADER,
  LOCAL_ADMIN_URL,
  LOCAL_MARKETING_URL,
  PRODUCTION_ADMIN_URL,
  PRODUCTION_MARKETING_URL,
  type AppSurface,
} from "@/config/hosts";
import { publicEnv } from "@/config/env";
import { defaultLocale, locales, type Locale } from "@/config/i18n";

export { APP_SURFACE_HEADER };
export type { AppSurface };

/** Canonical public origin — always the marketing site (never admin). */
export function getCanonicalOrigin(): string {
  return publicEnv.NEXT_PUBLIC_MARKETING_URL.replace(/\/$/, "");
}

export function getMarketingUrl(): string {
  return publicEnv.NEXT_PUBLIC_MARKETING_URL.replace(/\/$/, "");
}

export function getAdminUrl(): string {
  return publicEnv.NEXT_PUBLIC_ADMIN_URL.replace(/\/$/, "");
}

/** Host[:port] used for hostname matching. */
export function getHostKeyFromUrl(urlString: string): string {
  const url = new URL(urlString);
  return url.port ? `${url.hostname}:${url.port}` : url.hostname;
}

export function normalizeRequestHost(hostHeader: string): string {
  return hostHeader.trim().toLowerCase().replace(/\.$/, "");
}

export function getMarketingHostKey(): string {
  return getHostKeyFromUrl(getMarketingUrl()).toLowerCase();
}

export function getAdminHostKey(): string {
  return getHostKeyFromUrl(getAdminUrl()).toLowerCase();
}

/**
 * Resolve which app surface a Host header belongs to.
 *
 * Matching order:
 * 1. Exact admin host key
 * 2. Exact marketing host key
 * 3. Hostname starts with `admin.` (preview / alternate ports)
 * 4. Fallback → marketing
 */
export function detectAppSurface(hostHeader: string): AppSurface {
  const host = normalizeRequestHost(hostHeader);
  const adminKey = getAdminHostKey();
  const marketingKey = getMarketingHostKey();

  if (host === adminKey) return "studio";
  if (host === marketingKey) return "marketing";
  if (host.startsWith("admin.")) return "studio";
  return "marketing";
}

export function isAdminHost(hostHeader: string): boolean {
  return detectAppSurface(hostHeader) === "studio";
}

export function isMarketingHost(hostHeader: string): boolean {
  return detectAppSurface(hostHeader) === "marketing";
}

export function buildMarketingUrl(pathname = "/"): string {
  return new URL(pathname, `${getMarketingUrl()}/`).toString();
}

export function buildAdminUrl(pathname = "/"): string {
  return new URL(pathname, `${getAdminUrl()}/`).toString();
}

/** Absolute canonical URL for public SEO (always marketing origin). */
export function buildCanonicalUrl(pathname = "/"): string {
  return new URL(pathname, `${getCanonicalOrigin()}/`).toString();
}

type PathParts = {
  locale: Locale | null;
  /** Path after locale prefix, always starting with `/`. */
  pathnameWithoutLocale: string;
};

export function splitLocalePrefix(pathname: string): PathParts {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    const prefix = `/${locale}`;
    if (normalized === prefix) {
      return { locale, pathnameWithoutLocale: "/" };
    }
    if (normalized.startsWith(`${prefix}/`)) {
      return {
        locale,
        pathnameWithoutLocale: normalized.slice(prefix.length) || "/",
      };
    }
  }

  return { locale: null, pathnameWithoutLocale: normalized };
}

export function joinLocalePrefix(
  locale: Locale | null,
  pathnameWithoutLocale: string,
): string {
  const path = pathnameWithoutLocale.startsWith("/")
    ? pathnameWithoutLocale
    : `/${pathnameWithoutLocale}`;

  if (!locale || locale === defaultLocale) {
    return path === "" ? "/" : path;
  }

  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** True when the path targets the Studio app segment (`/studio`, `/fr/studio`, …). */
export function isStudioPath(pathname: string): boolean {
  const { pathnameWithoutLocale } = splitLocalePrefix(pathname);
  return (
    pathnameWithoutLocale === "/studio" ||
    pathnameWithoutLocale.startsWith("/studio/")
  );
}

/**
 * Map an admin-host public path onto the internal `/studio…` filesystem path.
 * Examples (default locale `fr`, as-needed; Studio forced to `/tr/studio…`):
 * - `/` → `/studio` (then middleware → `/tr/studio`)
 * - `/setup` → `/studio/setup` (then → `/tr/studio/setup`)
 * - `/studio` → `/studio` (unchanged; then → `/tr/studio`)
 * - `/tr/setup` → `/tr/studio/setup`
 */
export function mapAdminPathToInternal(pathname: string): string {
  const { locale, pathnameWithoutLocale } = splitLocalePrefix(pathname);

  if (
    pathnameWithoutLocale === "/studio" ||
    pathnameWithoutLocale.startsWith("/studio/")
  ) {
    return pathname;
  }

  const rest =
    pathnameWithoutLocale === "/"
      ? "/studio"
      : `/studio${pathnameWithoutLocale}`;

  return joinLocalePrefix(locale, rest);
}

/**
 * Map an internal `/studio…` path to a shorter admin-host URL (strip `/studio`).
 */
export function mapInternalStudioPathToAdminPath(pathname: string): string {
  const { locale, pathnameWithoutLocale } = splitLocalePrefix(pathname);

  if (pathnameWithoutLocale === "/studio") {
    return joinLocalePrefix(locale, "/");
  }

  if (pathnameWithoutLocale.startsWith("/studio/")) {
    const rest = pathnameWithoutLocale.slice("/studio".length) || "/";
    return joinLocalePrefix(locale, rest);
  }

  return pathname;
}

export function getLocalHostHints() {
  const isDev = process.env.NODE_ENV === "development";
  return {
    marketing: isDev ? LOCAL_MARKETING_URL : PRODUCTION_MARKETING_URL,
    admin: isDev ? LOCAL_ADMIN_URL : PRODUCTION_ADMIN_URL,
  } as const;
}
