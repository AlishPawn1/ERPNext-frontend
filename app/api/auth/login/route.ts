import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Convert to URLSearchParams (form data)
    const formData = new URLSearchParams({
      cmd: "login",
      usr: body.usr || body.email,
      pwd: body.pwd || body.password,
    });

    const frappeResponse = await fetch(`${FRAPPE_BASE_URL}/method/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData.toString(),
    });

    const data = await frappeResponse.json();

    // Create response
    const response = NextResponse.json(data, {
      status: frappeResponse.status,
    });

    // Forward cookies from Frappe
    const setCookieHeaders = frappeResponse.headers.getSetCookie();
    setCookieHeaders.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { error: "Login failed", details: error },
      { status: 500 }
    );
  }
}
