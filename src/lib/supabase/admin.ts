import "server-only";

import { createClient } from "@supabase/supabase-js";

import { env, publicEnv } from "@/config/env";

/**
 * Service-role Supabase client for privileged DB / Storage writes.
 * Server-only — never import from client components.
 */
export function createServiceRoleClient() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
