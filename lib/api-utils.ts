import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Default paths for CSRF bootstrapping - can be overridden
const DEFAULT_CSRF_PATHS = ["/"];

// -----------------------------------------------------------------------------
// Cookie & CSRF Utilities
// -----------------------------------------------------------------------------

/**
 * Extract CSRF token from cookies string
 */
export function getCSRFToken(cookies: string): string | null {
  if (!cookies) return null;
  const match = cookies.match(/(?:frappe_csrf_token|csrf_token)=([^;\s,]+)/i);
  return match ? decodeURIComponent(match[1]) : null;
}

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

/**
 * Bootstrap CSRF token by making initial requests
 * @param cookies - Current cookies from request
 * @param paths - Array of paths to try (defaults to ["/"])
 * @returns Object with csrf token and any set-cookie headers
 */
export async function bootstrapCSRF(
  cookies: string,
  paths: string[] = DEFAULT_CSRF_PATHS
): Promise<{ csrf: string | null; setCookies: string[] }> {
  const mergedCookies: string[] = [];

  for (const path of paths) {
    try {
      const resp = await fetch(`${FRAPPE_BASE_URL}${path}`, {
        method: "GET",
        headers: {
          Accept: path.startsWith("/resource")
            ? "application/json"
            : "text/html",
          Cookie: cookies,
        },
        credentials: "include",
      });

      const setCookies = getSetCookieHeaders(resp);
      mergedCookies.push(...setCookies);

      // Check for CSRF in Set-Cookie headers
      for (const cookie of setCookies) {
        const match = cookie.match(
          /(?:frappe_csrf_token|csrf_token)=([^;\s]+)/i
        );
        if (match) {
          return {
            csrf: decodeURIComponent(match[1]),
            setCookies: mergedCookies,
          };
        }
      }

      // Check for CSRF in response body (for HTML responses)
      const body = await resp.text();
      const htmlMatch = body.match(/frappe\.csrf_token\s*=\s*['"](.*?)['"]/);
      if (htmlMatch) {
        return { csrf: htmlMatch[1], setCookies: mergedCookies };
      }
    } catch {
      continue;
    }
  }

  // Last resort: check if CSRF is already in cookies
  const combined = [cookies, ...mergedCookies].join("; ");
  const match = combined.match(/(?:frappe_csrf_token|csrf_token)=([^;\s]+)/i);

  return {
    csrf: match ? decodeURIComponent(match[1]) : null,
    setCookies: mergedCookies,
  };
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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookies,
    };

    const csrf = getCSRFToken(cookies);
    if (csrf) headers["X-Frappe-CSRF-Token"] = csrf;

    const response = await fetch(`${FRAPPE_BASE_URL}${resourcePath}`, {
      method: "POST",
      headers,
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

    const csrf = getCSRFToken(cookies);
    if (!csrf) {
      return NextResponse.json(
        { error: "No CSRF token. Refresh." },
        { status: 401 }
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
          "X-Frappe-CSRF-Token": csrf,
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

    let csrf = getCSRFToken(cookies);
    let bootCookies: string[] = [];

    if (!csrf) {
      const boot = await bootstrapCSRF(cookies);
      csrf = boot.csrf;
      bootCookies = boot.setCookies;
    }

    if (!csrf) {
      return NextResponse.json(
        { error: "No CSRF token. Refresh the page." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${FRAPPE_BASE_URL}${resourcePath}/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Cookie: cookies,
          "X-Frappe-CSRF-Token": csrf,
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    bootCookies.forEach((cookie) =>
      nextResponse.headers.append("Set-Cookie", cookie)
    );
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
