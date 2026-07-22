/**
 * Dual-domain host configuration for Bonvera Studio.
 *
 * Production:
 * - Marketing (public): https://bonvera.food
 * - Admin:              https://admin.bonvera.food
 *
 * One Next.js deploy serves both; middleware selects the surface by hostname.
 * Single brand only — not a multi-tenant platform.
 */

export const APP_SURFACES = ["marketing", "studio"] as const;

export type AppSurface = (typeof APP_SURFACES)[number];

/** Request header set by middleware so RSC/layouts can read the active surface. */
export const APP_SURFACE_HEADER = "x-app-surface";

/** Production defaults (overridable via env). */
export const PRODUCTION_MARKETING_URL = "https://bonvera.food";
export const PRODUCTION_ADMIN_URL = "https://admin.bonvera.food";

/**
 * Local development defaults.
 * Use `http://admin.localhost:3000` for the admin surface (supported by modern browsers).
 */
export const LOCAL_MARKETING_URL = "http://localhost:3000";
export const LOCAL_ADMIN_URL = "http://admin.localhost:3000";
