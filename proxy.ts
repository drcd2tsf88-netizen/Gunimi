import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextRequest,
  NextResponse,
} from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Orbit Auth Proxy
//
// Refreshes the Supabase session on every request so both server components
// and server actions always see a valid, up-to-date session in cookies.
//
// Route rules:
//  • /dashboard, /workspace, /orbit-control  →  require auth (→ /login)
//  • /login, /register (exact)               →  redirect to /dashboard if
//                                               already authenticated
//  • Everything else                         →  pass through
// ─────────────────────────────────────────────────────────────────────────────

export async function proxy(
  request: NextRequest
) {
  // Build a mutable response that
  // we'll forward to the browser.

  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
        cookies: {
          // Read all cookies from the
          // incoming request.
          getAll() {
            return request
              .cookies
              .getAll();
          },

          // Write refreshed cookies
          // to BOTH the request and
          // the response so every
          // downstream reader sees
          // them.
          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({ name, value }) =>
                request.cookies.set(
                  name,
                  value
                )
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) =>
                response.cookies.set(
                  name,
                  value,
                  options
                )
            );
          },
        },
      }
    );

  // IMPORTANT: refreshes the
  // session and writes updated
  // cookies. Do not remove.

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  const { pathname } =
    request.nextUrl;

  // ─── Protected routes ─────────

  const isProtected = [
    "/dashboard",
    "/workspace",
    "/orbit-control",
  ].some((r) =>
    pathname.startsWith(r)
  );

  if (isProtected && !user) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  // ─── Auth pages ───────────────
  // Exact match only — /register/complete
  // and /register/verify must remain
  // accessible during the email-link flow.

  const isPlainAuthPage =
    pathname === "/login" ||
    pathname === "/register";

  if (
    isPlainAuthPage &&
    user
  ) {
    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );
  }

  return response;
}

// Default export so the file can
// be used directly as middleware.ts
// without changes.

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and
    // all static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
