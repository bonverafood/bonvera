import { headers } from "next/headers";

import {
  APP_SURFACE_HEADER,
  detectAppSurface,
  type AppSurface,
} from "@/lib/hosts";

/**
 * Read the active application surface for the current request.
 * Prefers the middleware header; falls back to Host detection.
 */
export async function getRequestAppSurface(): Promise<AppSurface> {
  const headerStore = await headers();
  const fromMiddleware = headerStore.get(APP_SURFACE_HEADER);

  if (fromMiddleware === "marketing" || fromMiddleware === "studio") {
    return fromMiddleware;
  }

  const host = headerStore.get("host") ?? "";
  return detectAppSurface(host);
}
