import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookies = req.cookies;

  const isLoggedIn = cookies.has("sid") || cookies.has("full_name");

  const path = req.nextUrl.pathname;

  if (isLoggedIn && (path === "/" || path === "/login")) {
    console.log("login");
    return NextResponse.redirect(new URL("/app/home", req.url));
  }

  if (!isLoggedIn && path !== "/login") {
    console.log("not login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("hey refreshed middleware");
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/app/:path*"],
};
