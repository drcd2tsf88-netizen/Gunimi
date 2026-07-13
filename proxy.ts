import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Orbit Auth Proxy
//
// Validates the Supabase session on every request so both Server Components
// and Server Actions always see a valid, up-to-date session in cookies.
//
// Route rules:
//  /dashboard/*              → require auth; GET → /login?next=..., POST → 401
//  /orbit-control/*          → require auth; page itself checks platform_role
//  /api/* (non-public)       → require auth → 401
//  /login (exact)            → redirect authenticated users to /dashboard
//  Everything else           → pass through
// ─────────────────────────────────────────────────────────────────────────────

// API routes that must remain accessible without a Supabase session.
const PUBLIC_API_PREFIXES = [
  "/api/health",             // uptime monitors
  "/api/workspace/invite/",  // invite preview (user may not be signed in yet)
  "/api/sentry-example-api", // Sentry test endpoint
];

const SUPPORTED_LOCALES = ["en", "sk", "cs"] as const;

function detectLocale(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;
  for (const part of acceptLanguage.split(",")) {
    const lang = part.trim().split(";")[0].trim().split("-")[0].toLowerCase();
    if ((SUPPORTED_LOCALES as readonly string[]).includes(lang)) return lang;
  }
  return null;
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function proxy(request: NextRequest) {
  // Detect the browser's preferred locale from Accept-Language at the Edge.
  // This is the only place where the raw header is always available.
  // We forward it as x-gunimi-locale-hint so i18n/request.ts can read it
  // reliably via headers() regardless of the server rendering context.
  const detectedLocale = detectLocale(request.headers.get("accept-language"));
  const requestHeaders = new Headers(request.headers);
  if (detectedLocale) requestHeaders.set("x-gunimi-locale-hint", detectedLocale);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // Write refreshed cookies to BOTH request and response so every
        // downstream Server Component and Server Action sees the new token.
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not run any code between createServerClient and
  // auth.getUser(). Per @supabase/ssr docs, any code here can make
  // the server-side auth check unreliable.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── /dashboard/* — protected pages ───────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      // Server Actions use POST — the client handles a 401 response.
      // Browser navigations use GET — redirect to /login with return path.
      if (request.method !== "GET") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // ── /orbit-control/* — platform admin pages ──────────────────
  // Page-level assertPlatformAdmin() handles role check.
  // Proxy only enforces that a session exists.
  if (pathname.startsWith("/orbit-control")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  // ── /api/* — protected API routes ────────────────────────────
  if (pathname.startsWith("/api") && !isPublicApi(pathname)) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return response;
  }

  // ── /login — redirect authenticated users to dashboard ───────
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static assets.
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
