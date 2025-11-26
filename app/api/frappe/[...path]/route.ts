import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function forwardSetCookieHeaders(
  frappeResponse: Response,
  response: NextResponse
): void {
  try {
    // Modern fetch API supports getSetCookie()
    const headers = frappeResponse.headers;

    if (
      "getSetCookie" in headers &&
      typeof headers.getSetCookie === "function"
    ) {
      const setCookieHeaders = headers.getSetCookie();
      setCookieHeaders.forEach((cookie: string) => {
        response.headers.append("Set-Cookie", cookie);
      });
    } else {
      // Fallback for older implementations
      const cookie = frappeResponse.headers.get("set-cookie");
      if (cookie) {
        response.headers.append("Set-Cookie", cookie);
      }
    }
  } catch (error) {
    console.error("Error forwarding Set-Cookie headers:", error);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const body = await request.json();
    const params = await context.params;
    const path = params.path.join("/");

    const frappeResponse = await fetch(`${FRAPPE_BASE_URL}/api/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await frappeResponse.json();

    const response = NextResponse.json(data, {
      status: frappeResponse.status,
    });

    forwardSetCookieHeaders(frappeResponse, response);

    return response;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const params = await context.params;
    const path = params.path.join("/");

    const frappeResponse = await fetch(`${FRAPPE_BASE_URL}/api/${path}`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    const data = await frappeResponse.json();

    const response = NextResponse.json(data, {
      status: frappeResponse.status,
    });

    forwardSetCookieHeaders(frappeResponse, response);

    return response;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
