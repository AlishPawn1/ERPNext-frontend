import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// -----------------------------------------------------------------------------
// Cookie Utilities
// -----------------------------------------------------------------------------

/**
 * Extract all Set-Cookie headers from response
 */
export function getSetCookieHeaders(response: Response): string[] {
  const headersRaw = response.headers as unknown as {
    getSetCookie?: () => string[];
  };

  if (typeof headersRaw.getSetCookie === "function") {
    const arr = headersRaw.getSetCookie();
    return Array.isArray(arr) ? arr : [];
  }

  const value = response.headers.get("set-cookie");
  return value ? [value] : [];
}

/**
 * Forward Set-Cookie headers from backend to client
 */
export function forwardCookies(from: Response, to: NextResponse): NextResponse {
  getSetCookieHeaders(from).forEach((cookie) =>
    to.headers.append("Set-Cookie", cookie)
  );
  return to;
}

// -----------------------------------------------------------------------------
// Generic Proxy Functions
// -----------------------------------------------------------------------------

/**
 * Proxy GET request to Frappe backend
 */
export async function proxyGet(
  request: NextRequest,
  resourcePath: string,
  resourceName: string
) {
  try {
    const search = request.nextUrl.search || "";
    const cookies = request.headers.get("cookie") || "";

    const response = await fetch(`${FRAPPE_BASE_URL}${resourcePath}${search}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookies,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: response.statusText, details: data },
        { status: response.status }
      );
    }

    const nextResponse = NextResponse.json(data, { status: 200 });
    return forwardCookies(response, nextResponse);
  } catch (error) {
    console.error(`${resourceName} API Error:`, error);
    return NextResponse.json(
      {
        error: `Failed to fetch ${resourceName.toLowerCase()}`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Proxy POST request to Frappe backend
 */
export async function proxyPost(
  request: NextRequest,
  resourcePath: string,
  resourceName: string
) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const body = await request.json();

    const response = await fetch(`${FRAPPE_BASE_URL}${resourcePath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookies,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    return forwardCookies(response, nextResponse);
  } catch (error) {
    console.error(`${resourceName} POST Error:`, error);
    return NextResponse.json(
      {
        error: `Failed to create ${resourceName.toLowerCase()}`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Proxy PUT request to Frappe backend
 */
export async function proxyPut(
  request: NextRequest,
  resourcePath: string,
  idParam: string,
  resourceName: string
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get(idParam);
    const cookies = request.headers.get("cookie") || "";
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: `Missing ${idParam}` },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${FRAPPE_BASE_URL}${resourcePath}/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: cookies,
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    return forwardCookies(response, nextResponse);
  } catch (error) {
    console.error(`${resourceName} PUT Error:`, error);
    return NextResponse.json(
      {
        error: `Failed to update ${resourceName.toLowerCase()}`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Proxy DELETE request to Frappe backend
 */
export async function proxyDelete(
  request: NextRequest,
  resourcePath: string,
  idParam: string,
  resourceName: string
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get(idParam);
    const cookies = request.headers.get("cookie") || "";

    if (!id) {
      return NextResponse.json(
        { error: `Missing ${idParam}` },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${FRAPPE_BASE_URL}${resourcePath}/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Cookie: cookies,
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    return forwardCookies(response, nextResponse);
  } catch (error) {
    console.error(`${resourceName} DELETE Error:`, error);
    return NextResponse.json(
      {
        error: `Failed to delete ${resourceName.toLowerCase()}`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
