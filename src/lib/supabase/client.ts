import { createBrowserClient } from "@supabase/ssr";

import { publicEnv } from "@/config/env";

/**
 * Browser Supabase client (cookie-based session for SSR middleware).
 */
export function createBrowserSupabaseClient() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createBrowserClient(url, anonKey);
}
