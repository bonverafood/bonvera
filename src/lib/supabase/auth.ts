import type { User } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Next.js throws special errors when `cookies()` / `headers()` are used during
 * static generation. Swallowing them marks auth routes as wrongly static and
 * authenticated Studio pages then 500 with a stable production digest.
 */
function rethrowIfNextDynamic(error: unknown): void {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string"
  ) {
    const digest = (error as { digest: string }).digest;
    if (
      digest === "DYNAMIC_SERVER_USAGE" ||
      digest.startsWith("NEXT_DYNAMIC") ||
      digest.startsWith("NEXT_PRERENDER")
    ) {
      throw error;
    }
  }

  if (
    error instanceof Error &&
    (error.message.includes("Dynamic server usage") ||
      error.message.includes("couldn't be rendered statically"))
  ) {
    throw error;
  }
}

export async function getStudioUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    rethrowIfNextDynamic(error);
    console.error("[auth] getStudioUser", error);
    return null;
  }
}

export async function requireStudioUser(): Promise<User> {
  const user = await getStudioUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}
