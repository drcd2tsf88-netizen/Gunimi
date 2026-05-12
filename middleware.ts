import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const token =
    request.cookies.get(
      "sb-access-token"
    )?.value;

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith(
      "/dashboard"
    );

  // Protect dashboard
  if (
    isDashboardRoute &&
    !token
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Redirect logged users away from auth
  if (
    token &&
    (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register"
    )
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
