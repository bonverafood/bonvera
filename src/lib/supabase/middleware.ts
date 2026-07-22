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
 * Safe no-op when Supabase env is missing.
 */
export async function updateSession(
  request: NextRequest,
  baseResponse: NextResponse,
): Promise<SessionResult> {
  let response = baseResponse;

  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { response, user: null };
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
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        // Preserve headers from the base (intl / surface) response.
        baseResponse.headers.forEach((value, key) => {
          if (key.toLowerCase() === "set-cookie") return;
          response.headers.set(key, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        // Re-apply any cookies already on baseResponse.
        baseResponse.cookies.getAll().forEach((cookie) => {
          if (!cookiesToSet.some((c) => c.name === cookie.name)) {
            response.cookies.set(cookie.name, cookie.value);
          }
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
