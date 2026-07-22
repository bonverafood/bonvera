import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

import { publicEnv } from "@/config/env";

type SessionResult = {
  response: NextResponse;
  user: User | null;
};

/**
 * Refresh the auth session and attach cookies onto `baseResponse`.
 *
 * IMPORTANT: Do NOT replace `baseResponse` with a fresh `NextResponse.next()`.
 * That wipes next-intl rewrites/headers and causes authenticated Studio RSC
 * renders to 500. Always mutate cookies on the intl response in place.
 */
export async function updateSession(
  request: NextRequest,
  baseResponse: NextResponse,
): Promise<SessionResult> {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { response: baseResponse, user: null };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          baseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: baseResponse, user };
}
