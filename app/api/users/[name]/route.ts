import { NextRequest } from "next/server";
import { proxyGet, proxyPut, proxyDelete } from "@/lib/api-utils";

async function getDecodedName(params: Promise<{ name: string }>) {
  const resolvedParams = await params;
  return decodeURIComponent(resolvedParams?.name ?? "");
}

function buildUserPath(decodedName: string) {
  return `/resource/User/${encodeURIComponent(decodedName)}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const decodedName = await getDecodedName(params);
  const target = buildUserPath(decodedName);
  return proxyGet(request, target, "User");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const resolvedParams = await params;
  const raw = resolvedParams?.name ?? "";
  const decodedName = decodeURIComponent(raw);

  const url = new URL(request.url);
  url.searchParams.set("name", decodedName);
  const modifiedRequest = new NextRequest(url, request);
  return proxyPut(modifiedRequest, "/resource/User", "name", "User");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const resolvedParams = await params;
  const raw = resolvedParams?.name ?? "";
  const decodedName = decodeURIComponent(raw);

  const url = new URL(request.url);
  url.searchParams.set("name", decodedName);
  const modifiedRequest = new NextRequest(url, request);
  return proxyDelete(modifiedRequest, "/resource/User", "name", "User");
}
