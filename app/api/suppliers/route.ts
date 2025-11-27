import { NextRequest } from "next/server";
import { proxyGet, proxyPost, proxyPut, proxyDelete } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  return proxyGet(request, "/resource/Supplier", "Supplier");
}

export async function POST(request: NextRequest) {
  return proxyPost(request, "/resource/Supplier", "Supplier");
}

export async function PUT(request: NextRequest) {
  return proxyPut(request, "/resource/Supplier", "name", "Supplier");
}

export async function DELETE(request: NextRequest) {
  return proxyDelete(request, "/resource/Supplier", "name", "Supplier");
}
