import { NextRequest } from "next/server";
import { proxyGet, proxyPost, proxyPut, proxyDelete } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  return proxyGet(request, "/resource/Customer", "Customer");
}

export async function POST(request: NextRequest) {
  return proxyPost(request, "/resource/Customer", "Customer");
}

export async function PUT(request: NextRequest) {
  return proxyPut(request, "/resource/Customer", "name", "Customer");
}

export async function DELETE(request: NextRequest) {
  return proxyDelete(request, "/resource/Customer", "name", "Customer");
}
