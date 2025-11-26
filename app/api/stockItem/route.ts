import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Extract CSRF token from cookies
function getCSRFTokenFromCookies(cookies: string): string | null {
  const match = cookies.match(/csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookies = request.headers.get("cookie") || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookies,
    };

    // Get CSRF token from existing cookies
    const csrfToken = getCSRFTokenFromCookies(cookies);
    if (csrfToken) {
      headers["X-Frappe-CSRF-Token"] = csrfToken;
      console.log("✓ CSRF token obtained from cookies");
    } else {
      console.warn("⚠ No CSRF token found in cookies");
    }

    const resp = await fetch(`${FRAPPE_BASE_URL}/resource/Item`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Backend error:", resp.status, errorText);
      return NextResponse.json(
        { error: `Backend error: ${resp.statusText}`, details: errorText },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    const response = NextResponse.json(data, { status: 201 });

    // Forward Set-Cookie headers back to browser
    const setCookieHeaders = resp.headers.getSetCookie();
    setCookieHeaders.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error: unknown) {
    console.error("POST Stock Item Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create stock item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.search || "";
    const backendUrl = `${FRAPPE_BASE_URL}/resource/Item${search}`;
    const cookies = request.headers.get("cookie") || "";

    const resp = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookies,
      },
      credentials: "include",
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Backend error:", resp.status, errorText);
      return NextResponse.json(
        { error: `Backend error: ${resp.statusText}`, details: errorText },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    const response = NextResponse.json(data, { status: 200 });

    // Forward Set-Cookie headers back to browser
    const setCookieHeaders = resp.headers.getSetCookie();
    setCookieHeaders.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error: unknown) {
    console.error("Stock Item API Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch stock items";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemCode = searchParams.get("item_code");
    const cookies = request.headers.get("cookie") || "";

    if (!itemCode) {
      return NextResponse.json(
        { error: "Missing item_code parameter" },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      Cookie: cookies,
    };

    // Get CSRF token from existing cookies
    const csrfToken = getCSRFTokenFromCookies(cookies);
    if (csrfToken) {
      headers["X-Frappe-CSRF-Token"] = csrfToken;
    }

    const resp = await fetch(`${FRAPPE_BASE_URL}/resource/Item/${itemCode}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Backend error:", resp.status, errorText);
      return NextResponse.json(
        { error: `Backend error: ${resp.statusText}`, details: errorText },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE Stock Item Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete stock item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
