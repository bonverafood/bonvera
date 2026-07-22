import type { User } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
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
