import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "@/lib/i18n/routing";
import {
  APP_SURFACE_HEADER,
  buildAdminUrl,
  detectAppSurface,
  isStudioPath,
  mapAdminPathToInternal,
} from "@/lib/hosts";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_ROBOTS_BODY = `User-agent: *
Disallow: /

# Studio Admin — never index
`;

function withSurfaceHeaders(
  response: NextResponse,
  surface: "marketing" | "studio",
) {
  response.headers.set(APP_SURFACE_HEADER, surface);
  if (surface === "studio") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const surface = detectAppSurface(host);
  const { pathname } = request.nextUrl;

  // Admin must never be indexed — short-circuit robots.txt on admin host.
  if (surface === "studio" && pathname === "/robots.txt") {
    return withSurfaceHeaders(
      new NextResponse(ADMIN_ROBOTS_BODY, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      }),
      "studio",
    );
  }

  // Marketing host must not serve Studio — send users to the admin domain.
  if (surface === "marketing" && isStudioPath(pathname)) {
    const url = new URL(buildAdminUrl(pathname));
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 308);
  }

  // Admin host: normalize short paths onto `/studio…`, then let next-intl run.
  // Example: admin.bonvera.food/ → /studio (same host), then locale middleware.
  if (surface === "studio") {
    const internalPath = mapAdminPathToInternal(pathname);
    if (internalPath !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = internalPath;
      return withSurfaceHeaders(NextResponse.redirect(url, 308), "studio");
    }
  }

  const response = intlMiddleware(request);
  return withSurfaceHeaders(response, surface);
}

export const config = {
  // Skip API, Next internals, Vercel internals, and static files with extensions.
  // Explicitly include robots.txt for the admin disallow response.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/robots.txt"],
};
