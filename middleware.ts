import { NextResponse, type NextRequest } from "next/server";

// ─── Locale hint middleware ────────────────────────────────────────────────────
// Sets x-gunimi-locale-hint from Accept-Language so i18n/request.ts can read
// the real browser locale at the edge (avoids cache pollution).
//
// Matcher excludes: /api/*, /_next/*, static files, monitoring.
// This ensures cron jobs and API routes are never blocked by this middleware.

export function middleware(request: NextRequest): NextResponse {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const hint = acceptLanguage.split(",")[0]?.trim().split(";")[0]?.trim().split("-")[0]?.toLowerCase() ?? "en";

  const response = NextResponse.next();
  response.headers.set("x-gunimi-locale-hint", hint);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|monitoring|favicon.ico|robots.txt|sitemap.xml|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
