import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.search || "";
    const backendUrl = `${FRAPPE_BASE_URL}/resource/UOM${search}`;

    const resp = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Forward cookies for authentication
        Cookie: request.headers.get("cookie") || "",
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
    const setCookie = resp.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("Set-Cookie", setCookie);
    }

    return response;
  } catch (error: unknown) {
    console.error("UOM API Error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch UOM";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
