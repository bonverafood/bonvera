import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "@/lib/i18n/routing";
import {
  APP_SURFACE_HEADER,
  buildAdminUrl,
  detectAppSurface,
  isStudioPath,
  joinLocalePrefix,
  mapAdminPathToInternal,
  splitLocalePrefix,
} from "@/lib/hosts";
import { updateSession } from "@/lib/supabase/middleware";

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

/** Preserve refreshed auth cookies when replacing the intl response with a redirect. */
function copyCookies(from: NextResponse, to: NextResponse) {
  const setCookies =
    typeof from.headers.getSetCookie === "function"
      ? from.headers.getSetCookie()
      : [];
  for (const cookie of setCookies) {
    to.headers.append("set-cookie", cookie);
  }
  return to;
}

function isStudioLoginPath(pathname: string) {
  const { pathnameWithoutLocale } = splitLocalePrefix(pathname);
  return pathnameWithoutLocale === "/studio/login";
}

export default async function middleware(request: NextRequest) {
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
  // External 308 keeps the public URL on `/studio…` so localePrefix as-needed
  // + next-intl rewrites stay aligned with the App Router tree.
  if (surface === "studio") {
    const internalPath = mapAdminPathToInternal(pathname);
    if (internalPath !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = internalPath;
      return withSurfaceHeaders(NextResponse.redirect(url, 308), "studio");
    }
  }

  // Official next-intl + Supabase order: intl first, then mutate cookies on
  // that same response (never NextResponse.next() — it drops the rewrite).
  const intlResponse = withSurfaceHeaders(intlMiddleware(request), surface);
  const { response, user } = await updateSession(request, intlResponse);

  // Studio auth gate (marketing unaffected).
  if (surface === "studio" && isStudioPath(pathname)) {
    const { locale } = splitLocalePrefix(pathname);
    const onLogin = isStudioLoginPath(pathname);

    if (!user && !onLogin) {
      const url = request.nextUrl.clone();
      url.pathname = joinLocalePrefix(locale, "/studio/login");
      url.search = "";
      const next = pathname + (request.nextUrl.search || "");
      url.searchParams.set("next", next);
      const redirect = withSurfaceHeaders(NextResponse.redirect(url), "studio");
      return copyCookies(response, redirect);
    }

    if (user && onLogin) {
      const url = request.nextUrl.clone();
      const next = request.nextUrl.searchParams.get("next");
      url.pathname =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next.split("?")[0]!
          : joinLocalePrefix(locale, "/studio");
      url.search = "";
      const redirect = withSurfaceHeaders(NextResponse.redirect(url), "studio");
      return copyCookies(response, redirect);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/robots.txt"],
};
