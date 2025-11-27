import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const PUBLIC_PAGES = ["/login"];

  const isPublic = PUBLIC_PAGES.includes(path);

  // Read cookie values
  const sid = req.cookies.get("sid")?.value;
  const fullName = req.cookies.get("full_name")?.value;

  // User is logged in ONLY if cookies are present and NOT "Guest"
  const isLoggedIn = sid && sid !== "Guest" && fullName && fullName !== "Guest";

  // Guest trying to visit protected route → redirect to login
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in user trying to visit login → redirect to dashboard
  if (isLoggedIn && path === "/login") {
    return NextResponse.redirect(new URL("/app/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*", "/api/:path*"],
};
