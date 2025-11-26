import { NextRequest, NextResponse } from 'next/server';

const FRAPPE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Fetch CSRF token from Frappe
async function getCSRFToken(cookies: string): Promise<string | null> {
  try {
    const response = await fetch(`${FRAPPE_BASE_URL}/resource/DocType/Item`, {
      method: 'GET',
      headers: {
        'Cookie': cookies,
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    // Check response headers for CSRF token
    const setCookieHeaders = response.headers.getSetCookie();
    for (const cookie of setCookieHeaders) {
      if (cookie.includes('frappe_csrf_token=')) {
        const match = cookie.match(/frappe_csrf_token=([^;]+)/);
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
      }
    }

    // Fallback: try to get it from response body if it's a Frappe page
    const text = await response.text();
    const match = text.match(/frappe\.csrf_token\s*=\s*['"](.*?)['"]/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookies = request.headers.get('cookie') || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': cookies,
    };

    // Try to get CSRF token for POST requests
    const csrfToken = await getCSRFToken(cookies);
    if (csrfToken) {
      headers['X-Frappe-CSRF-Token'] = csrfToken;
      console.log('✓ CSRF token obtained');
    } else {
      console.warn('⚠ Could not obtain CSRF token, attempting request anyway');
    }

    const resp = await fetch(`${FRAPPE_BASE_URL}/resource/Item`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Backend error:', resp.status, errorText);
      return NextResponse.json(
        { error: `Backend error: ${resp.statusText}`, details: errorText },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    const response = NextResponse.json(data, { status: 201 });

    // Forward Set-Cookie headers back to browser
    const setCookieHeaders = resp.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error: unknown) {
    console.error('POST Stock Item Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create stock item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.search || '';
    const backendUrl = `${FRAPPE_BASE_URL}/resource/Item${search}`;
    const cookies = request.headers.get('cookie') || '';

    const resp = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookies,
      },
      credentials: 'include',
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Backend error:', resp.status, errorText);
      return NextResponse.json(
        { error: `Backend error: ${resp.statusText}`, details: errorText },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    const response = NextResponse.json(data, { status: 200 });

    // Forward Set-Cookie headers back to browser
    const setCookieHeaders = resp.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error: unknown) {
    console.error('Stock Item API Error:', error);
    const message = error instanceof Error
      ? error.message
      : 'Failed to fetch stock items';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemCode = searchParams.get('item_code');
    const cookies = request.headers.get('cookie') || '';

    if (!itemCode) {
      return NextResponse.json({ error: 'Missing item_code parameter' }, { status: 400 });
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Cookie': cookies,
    };

    // Try to get CSRF token for DELETE requests
    const csrfToken = await getCSRFToken(cookies);
    if (csrfToken) {
      headers['X-Frappe-CSRF-Token'] = csrfToken;
    }

    const resp = await fetch(`${FRAPPE_BASE_URL}/resource/Item/${itemCode}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Backend error:', resp.status, errorText);
      return NextResponse.json(
        { error: `Backend error: ${resp.statusText}`, details: errorText },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error('DELETE Stock Item Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete stock item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}