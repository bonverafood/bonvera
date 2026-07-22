import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";

import { listMediaAssets } from "@/lib/data";
import { getStudioUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * Temporary Studio SSR diagnostics (no secrets).
 * Open while logged in: https://admin.bonvera.food/api/studio-debug
 */
export async function GET() {
  const result: Record<string, string | boolean | number | null> = {
    ok: true,
    cookiesApi: "pending",
    cookieCount: 0,
    hasSbAuthCookie: false,
    getStudioUser: "pending",
    userIdPresent: false,
    listMediaAssets: "pending",
    mediaCount: null,
    getTranslationsMediaStudio: "pending",
  };

  try {
    const store = await cookies();
    const all = store.getAll();
    result.cookiesApi = "ok";
    result.cookieCount = all.length;
    result.hasSbAuthCookie = all.some(
      (c) =>
        c.name.includes("sb-") &&
        (c.name.includes("auth-token") || c.name.includes("access-token")),
    );
  } catch (error) {
    result.ok = false;
    result.cookiesApi = error instanceof Error ? error.message : String(error);
  }

  try {
    const user = await getStudioUser();
    result.getStudioUser = "ok";
    result.userIdPresent = Boolean(user?.id);
  } catch (error) {
    result.ok = false;
    result.getStudioUser =
      error instanceof Error ? error.message : String(error);
  }

  try {
    const rows = await listMediaAssets();
    result.listMediaAssets = "ok";
    result.mediaCount = rows.length;
  } catch (error) {
    result.ok = false;
    result.listMediaAssets =
      error instanceof Error ? error.message : String(error);
  }

  try {
    // Explicit locale — route handlers have no next-intl request scope.
    const t = await getTranslations({
      locale: "tr",
      namespace: "MediaStudio",
    });
    void t("title");
    result.getTranslationsMediaStudio = "ok";
  } catch (error) {
    result.ok = false;
    result.getTranslationsMediaStudio =
      error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(result, {
    status: result.ok ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
