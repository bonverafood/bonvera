import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API, Next internals, Vercel internals, and static files.
  // Locale codes are not hardcoded — they come from `src/config/i18n.ts`.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
