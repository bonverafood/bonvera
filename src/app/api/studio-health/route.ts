import { NextResponse } from "next/server";

import { env, publicEnv } from "@/config/env";

/**
 * Lightweight diagnostics for Studio crashes (no auth required).
 * Open: https://admin.bonvera.food/api/studio-health
 */
export async function GET() {
  const checks: Record<string, string | boolean> = {
    ok: true,
    hasSupabaseUrl: Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRole: Boolean(env.SUPABASE_SERVICE_ROLE_KEY),
    marketingUrl: publicEnv.NEXT_PUBLIC_MARKETING_URL,
    adminUrl: publicEnv.NEXT_PUBLIC_ADMIN_URL,
  };

  if (env.SUPABASE_SERVICE_ROLE_KEY && publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createServiceRoleClient } = await import(
        "@/lib/supabase/admin"
      );
      const supabase = createServiceRoleClient();
      const { error: productsError } = await supabase
        .from("products")
        .select("id")
        .limit(1);
      const { error: mediaError } = await supabase
        .from("media_assets")
        .select("id")
        .limit(1);
      const { error: seoError } = await supabase
        .from("site_seo_defaults")
        .select("id")
        .limit(1);

      checks.products = productsError ? productsError.message : "ok";
      checks.media_assets = mediaError ? mediaError.message : "ok";
      checks.site_seo_defaults = seoError ? seoError.message : "ok";
      if (productsError || mediaError || seoError) checks.ok = false;
    } catch (error) {
      checks.ok = false;
      checks.serviceRoleError =
        error instanceof Error ? error.message : String(error);
    }
  } else {
    checks.ok = false;
    checks.serviceRoleError = "SUPABASE_SERVICE_ROLE_KEY missing on server";
  }

  return NextResponse.json(checks, {
    status: checks.ok ? 200 : 503,
  });
}
