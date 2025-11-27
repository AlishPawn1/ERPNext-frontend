import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookies = req.cookies;
  const sid = cookies.get("sid")?.value;
  const fullName = cookies.get("full_name")?.value;

  const isLoggedIn =
    (sid && sid !== "Guest") || (fullName && fullName !== "Guest");

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
