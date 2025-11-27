import { NextRequest, NextResponse } from "next/server";
import { getCSRFToken, forwardCookies } from "@/lib/api-utils";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";

    const csrfFromHeader =
      request.headers.get("x-frappe-csrf-token") ??
      request.headers.get("x-csrf-token");

    const csrfToken = csrfFromHeader ?? getCSRFToken(cookies);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (cookies) headers.Cookie = cookies;
    if (csrfToken) headers["X-Frappe-CSRF-Token"] = csrfToken;

    let frappeResponse = await fetch(`${FRAPPE_BASE_URL}/method/logout`, {
      method: "POST",
      headers,
    });

    // Fallback to GET if CSRF failed
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

    const textBody = await frappeResponse.text();
    let body: unknown = { message: "Logged out" };

    if (textBody) {
      try {
        body = JSON.parse(textBody);
      } catch {
        body = { message: textBody.trim() || "Logged out" };
      }
    }

    const response = NextResponse.json(body, {
      status: frappeResponse.status,
    });

    return forwardCookies(frappeResponse, response);
  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}