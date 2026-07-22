import type { User } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

function isNextDynamicBailout(error: unknown): boolean {
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
      return true;
    }
  }
  return (
    error instanceof Error &&
    (error.message.includes("Dynamic server usage") ||
      error.message.includes("couldn't be rendered statically"))
  );
}

export async function getStudioUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    // Never swallow Next.js dynamic-rendering bailouts.
    if (isNextDynamicBailout(error)) throw error;
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
