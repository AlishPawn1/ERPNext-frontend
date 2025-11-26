import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") ?? "";

    // Extract CSRF token: header first, then cookie fallback
    const csrfFromHeader =
      request.headers.get("x-frappe-csrf-token") ??
      request.headers.get("x-csrf-token");

    const csrfFromCookie = cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/i)?.[1];

    const csrfToken = csrfFromHeader ?? csrfFromCookie;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (cookie) headers.Cookie = cookie;
    if (csrfToken) headers["X-Frappe-CSRF-Token"] = csrfToken;

    // Try POST logout first (respects CSRF)
    let frappeResponse = await fetch(`${FRAPPE_BASE_URL}/method/logout`, {
      method: "POST",
      headers,
    });

    // Fallback to GET if POST was rejected due to CSRF issues
    if (frappeResponse.status === 400 || frappeResponse.status === 403) {
      const text = await frappeResponse.text();
      if (
        text.toLowerCase().includes("csrf") ||
        text.includes("invalid request")
      ) {
        frappeResponse = await fetch(`${FRAPPE_BASE_URL}/method/logout`, {
          method: "GET",
          headers,
        });
      }
    }

    // Parse response body safely
    const textBody = await frappeResponse.text();
    let body: unknown = { message: "Logged out" };

    if (textBody) {
      try {
        body = JSON.parse(textBody);
      } catch {
        body = { message: textBody.trim() || "Logged out" };
      }
    }

    // Forward response + clear session cookies
    const response = NextResponse.json(body, { status: frappeResponse.status });

    // Properly forward all Set-Cookie headers (Frappe clears session with these)
    const setCookies = frappeResponse.headers.getSetCookie();
    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
