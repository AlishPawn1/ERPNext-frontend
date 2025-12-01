import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";

    const frappeResponse = await fetch(`${FRAPPE_BASE_URL}/method/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookies,
      },
    });

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

    // Forward cookie clearing from logout response
    const setCookies = frappeResponse.headers.get("set-cookie");
    if (setCookies) {
      response.headers.set("Set-Cookie", setCookies);
    }

    return response;
  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
