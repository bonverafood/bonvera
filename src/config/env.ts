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

const publicSchema = z.object({
  /**
   * @deprecated Prefer NEXT_PUBLIC_MARKETING_URL. Kept as alias for older tooling.
   */
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_MARKETING_URL: z.string().url().optional(),
  NEXT_PUBLIC_ADMIN_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_DEFAULT_LOCALE: localeCode.default("tr"),
  NEXT_PUBLIC_FALLBACK_LOCALE: localeCode.default("tr"),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type PublicEnv = ReturnType<typeof normalizePublicEnv>;

function emptyToUndefined(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function defaultMarketingUrl(nodeEnv: string) {
  return nodeEnv === "development"
    ? LOCAL_MARKETING_URL
    : PRODUCTION_MARKETING_URL;
}

function defaultAdminUrl(nodeEnv: string) {
  return nodeEnv === "development" ? LOCAL_ADMIN_URL : PRODUCTION_ADMIN_URL;
}

function normalizePublicEnv(
  data: z.infer<typeof publicSchema>,
  nodeEnv: string,
) {
  const marketingUrl =
    data.NEXT_PUBLIC_MARKETING_URL ??
    data.NEXT_PUBLIC_APP_URL ??
    defaultMarketingUrl(nodeEnv);

  const adminUrl = data.NEXT_PUBLIC_ADMIN_URL ?? defaultAdminUrl(nodeEnv);

  return {
    ...data,
    NEXT_PUBLIC_MARKETING_URL: marketingUrl,
    NEXT_PUBLIC_ADMIN_URL: adminUrl,
    /** Canonical public site URL (always marketing). */
    NEXT_PUBLIC_APP_URL: marketingUrl,
  };
}

function parseEnv() {
  const server = serverSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: emptyToUndefined(process.env.DATABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: emptyToUndefined(
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    ),
    OPENAI_API_KEY: emptyToUndefined(process.env.OPENAI_API_KEY),
  });

  const pub = publicSchema.safeParse({
    NEXT_PUBLIC_APP_URL: emptyToUndefined(process.env.NEXT_PUBLIC_APP_URL),
    NEXT_PUBLIC_MARKETING_URL: emptyToUndefined(
      process.env.NEXT_PUBLIC_MARKETING_URL,
    ),
    NEXT_PUBLIC_ADMIN_URL: emptyToUndefined(process.env.NEXT_PUBLIC_ADMIN_URL),
    NEXT_PUBLIC_SUPABASE_URL: emptyToUndefined(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: emptyToUndefined(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    NEXT_PUBLIC_FALLBACK_LOCALE: process.env.NEXT_PUBLIC_FALLBACK_LOCALE,
  });

  if (!server.success || !pub.success) {
    const issues = [
      ...(server.success ? [] : server.error.issues),
      ...(pub.success ? [] : pub.error.issues),
    ];
    const message = issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${message}`);
  }

  return {
    server: server.data,
    public: normalizePublicEnv(pub.data, server.data.NODE_ENV),
  };
}

const parsed = parseEnv();

export const env = parsed.server;
export const publicEnv = parsed.public;
