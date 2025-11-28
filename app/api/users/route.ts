import { NextRequest } from "next/server";
import { proxyGet, proxyPost, proxyPut, proxyDelete } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  return proxyGet(request, "/resource/User", "User");
}

export async function POST(request: NextRequest) {
  return proxyPost(request, "/resource/User", "User");
}

export async function PUT(request: NextRequest) {
  return proxyPut(request, "/resource/User", "name", "User");
}

export async function DELETE(request: NextRequest) {
  return proxyDelete(request, "/resource/User", "name", "User");
}
