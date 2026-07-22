import "server-only";

import { cookies } from "next/headers";
import { connection } from "next/server";

/**
 * Hard opt-into per-request Studio rendering.
 *
 * Parent `[locale]` uses `generateStaticParams`, so layout-level
 * `dynamic = "force-dynamic"` alone is not always enough — authenticated
 * RSC requests then 500 with an opaque production digest.
 */
export async function ensureStudioDynamic() {
  await connection();
  await cookies();
}
