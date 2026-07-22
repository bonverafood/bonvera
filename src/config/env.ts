import { z } from "zod";

import {
  LOCAL_ADMIN_URL,
  LOCAL_MARKETING_URL,
  PRODUCTION_ADMIN_URL,
  PRODUCTION_MARKETING_URL,
} from "@/config/hosts";

/**
 * Environment contract.
 * - Validated once when this module is first imported on the server.
 * - Browser code must only read `NEXT_PUBLIC_*` via `publicEnv`.
 * - Optional vars must never crash production builds when missing/blank.
 */

const localeCode = z
  .string()
  .trim()
  .min(2)
  .max(12)
  .regex(/^[a-z]{2}(-[A-Za-z]+)?$/);

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

function emptyToUndefined(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Accept a real URL, or treat blank/invalid optional values as unset. */
function parseOptionalUrl(
  value: string | undefined,
  name: string,
): string | undefined {
  const trimmed = emptyToUndefined(value);
  if (!trimmed) return undefined;
  const result = z.string().url().safeParse(trimmed);
  if (!result.success) {
    console.warn(
      `[env] Ignoring invalid ${name}=${JSON.stringify(trimmed)} — treated as unset.`,
    );
    return undefined;
  }
  return result.data;
}

function parseOptionalSecret(value: string | undefined): string | undefined {
  return emptyToUndefined(value);
}

function defaultMarketingUrl(nodeEnv: string) {
  return nodeEnv === "development"
    ? LOCAL_MARKETING_URL
    : PRODUCTION_MARKETING_URL;
}

function defaultAdminUrl(nodeEnv: string) {
  return nodeEnv === "development" ? LOCAL_ADMIN_URL : PRODUCTION_ADMIN_URL;
}

function parseEnv() {
  const nodeEnvResult = z
    .enum(["development", "test", "production"])
    .default("development")
    .safeParse(process.env.NODE_ENV);
  const nodeEnv = nodeEnvResult.success ? nodeEnvResult.data : "development";

  const server = serverSchema.safeParse({
    NODE_ENV: nodeEnv,
    DATABASE_URL: parseOptionalSecret(process.env.DATABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: parseOptionalSecret(
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    ),
    OPENAI_API_KEY: parseOptionalSecret(process.env.OPENAI_API_KEY),
  });

  if (!server.success) {
    const message = server.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${message}`);
  }

  const defaultLocale = localeCode
    .default("tr")
    .safeParse(process.env.NEXT_PUBLIC_DEFAULT_LOCALE);
  const fallbackLocale = localeCode
    .default("tr")
    .safeParse(process.env.NEXT_PUBLIC_FALLBACK_LOCALE);

  const marketingUrl =
    parseOptionalUrl(
      process.env.NEXT_PUBLIC_MARKETING_URL,
      "NEXT_PUBLIC_MARKETING_URL",
    ) ??
    parseOptionalUrl(process.env.NEXT_PUBLIC_APP_URL, "NEXT_PUBLIC_APP_URL") ??
    defaultMarketingUrl(server.data.NODE_ENV);

  const adminUrl =
    parseOptionalUrl(
      process.env.NEXT_PUBLIC_ADMIN_URL,
      "NEXT_PUBLIC_ADMIN_URL",
    ) ?? defaultAdminUrl(server.data.NODE_ENV);

  const publicEnv = {
    NEXT_PUBLIC_APP_URL: marketingUrl,
    NEXT_PUBLIC_MARKETING_URL: marketingUrl,
    NEXT_PUBLIC_ADMIN_URL: adminUrl,
    NEXT_PUBLIC_SUPABASE_URL: parseOptionalUrl(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: parseOptionalSecret(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    NEXT_PUBLIC_DEFAULT_LOCALE: defaultLocale.success
      ? defaultLocale.data
      : "tr",
    NEXT_PUBLIC_FALLBACK_LOCALE: fallbackLocale.success
      ? fallbackLocale.data
      : "tr",
  };

  return {
    server: server.data,
    public: publicEnv,
  };
}

const parsed = parseEnv();

export const env = parsed.server;
export const publicEnv = parsed.public;
export type PublicEnv = typeof publicEnv;
