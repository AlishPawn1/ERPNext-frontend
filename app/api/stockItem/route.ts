import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getCSRFTokenFromCookies(cookies: string): string | null {
  if (!cookies) return null;
  const match = cookies.match(/(?:frappe_csrf_token|csrf_token)=([^;\s,]+)/i);
  return match ? decodeURIComponent(match[1]) : null;
}

function extractSetCookieArray(backResp: Response): string[] {
  const headersRaw = backResp.headers as unknown as {
    getSetCookie?: () => string[];
  };

  if (typeof headersRaw.getSetCookie === "function") {
    const arr = headersRaw.getSetCookie();
    return Array.isArray(arr) ? arr : [];
  }

  const v = backResp.headers.get("set-cookie");
  return v ? [v] : [];
}

async function bootstrapCSRF(
  cookies: string
): Promise<{ csrf: string | null; setCookies: string[] }> {
  const paths = ["/resource/DocType/Item", "/"];
  const mergedCookies: string[] = [];

  for (const p of paths) {
    try {
      const resp = await fetch(`${FRAPPE_BASE_URL}${p}`, {
        method: "GET",
        headers: {
          Accept: p.startsWith("/resource") ? "application/json" : "text/html",
          Cookie: cookies,
        },
        credentials: "include",
      });

      const sc = extractSetCookieArray(resp);
      mergedCookies.push(...sc);

      for (const c of sc) {
        const m = c.match(/(?:frappe_csrf_token|csrf_token)=([^;\s]+)/i);
        if (m) {
          return {
            csrf: decodeURIComponent(m[1]),
            setCookies: mergedCookies,
          };
        }
      }

      const body = await resp.text();
      const htmlMatch = body.match(/frappe\.csrf_token\s*=\s*['"](.*?)['"]/);
      if (htmlMatch) {
        return { csrf: htmlMatch[1], setCookies: mergedCookies };
      }
    } catch {
      /* ignore */
    }
  }

  const combined = [cookies, ...mergedCookies].join("; ");
  const m = combined.match(/(?:frappe_csrf_token|csrf_token)=([^;\s]+)/i);

  return {
    csrf: m ? decodeURIComponent(m[1]) : null,
    setCookies: mergedCookies,
  };
}

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.search || "";
    const cookies = request.headers.get("cookie") || "";

    const resp = await fetch(`${FRAPPE_BASE_URL}/resource/Item${search}`, {
      method: "GET",
      headers: { Accept: "application/json", Cookie: cookies },
      credentials: "include",
    });

    const data = await resp.json();

    if (!resp.ok) {
      return NextResponse.json(
        { error: resp.statusText, details: data },
        { status: resp.status }
      );
    }

    const next = NextResponse.json(data, { status: 200 });

    extractSetCookieArray(resp).forEach((c) =>
      next.headers.append("Set-Cookie", c)
    );

    return next;
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch stock items", details: `${err}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const body = await request.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookies,
    };

    const csrf = getCSRFTokenFromCookies(cookies);
    if (csrf) headers["X-Frappe-CSRF-Token"] = csrf;

    const resp = await fetch(`${FRAPPE_BASE_URL}/resource/Item`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    const next = NextResponse.json(data, { status: resp.status });

    extractSetCookieArray(resp).forEach((c) =>
      next.headers.append("Set-Cookie", c)
    );

    return next;
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create item", details: `${err}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemCode = searchParams.get("item_code");
    const cookies = request.headers.get("cookie") || "";
    const body = await request.json();

    if (!itemCode)
      return NextResponse.json({ error: "Missing item_code" }, { status: 400 });

    const csrf = getCSRFTokenFromCookies(cookies);
    if (!csrf)
      return NextResponse.json(
        { error: "No CSRF token. Refresh." },
        { status: 401 }
      );

    const resp = await fetch(
      `${FRAPPE_BASE_URL}/resource/Item/${encodeURIComponent(itemCode)}`,
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

    const data = await resp.json();
    const next = NextResponse.json(data, { status: resp.status });

    extractSetCookieArray(resp).forEach((c) =>
      next.headers.append("Set-Cookie", c)
    );

    return next;
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update item", details: `${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemCode = searchParams.get("item_code");
    const cookies = request.headers.get("cookie") || "";

    if (!itemCode)
      return NextResponse.json({ error: "Missing item_code" }, { status: 400 });

    let csrf = getCSRFTokenFromCookies(cookies);
    let bootCookies: string[] = [];

    if (!csrf) {
      const boot = await bootstrapCSRF(cookies);
      csrf = boot.csrf;
      bootCookies = boot.setCookies;
    }

    if (!csrf)
      return NextResponse.json(
        { error: "No CSRF token. Refresh the page." },
        { status: 401 }
      );

    const resp = await fetch(
      `${FRAPPE_BASE_URL}/resource/Item/${encodeURIComponent(itemCode)}`,
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

    const data = await resp.json();
    const next = NextResponse.json(data, { status: resp.status });

    bootCookies.forEach((c) => next.headers.append("Set-Cookie", c));
    extractSetCookieArray(resp).forEach((c) =>
      next.headers.append("Set-Cookie", c)
    );

    return next;
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete item", details: `${err}` },
      { status: 500 }
    );
  }
}
