<<<<<<< Updated upstream
import { NextRequest } from "next/server";
import { proxyGet, proxyPost, proxyPut, proxyDelete } from "@/lib/api-utils";
=======

import { NextRequest } from "next/server";
import {
  proxyGet,
  proxyPost,
  proxyPut,
  proxyDelete,
} from "@/lib/api-utils";
>>>>>>> Stashed changes

export async function GET(request: NextRequest) {
  return proxyGet(request, "/resource/Item", "Item");
}

export async function POST(request: NextRequest) {
  return proxyPost(request, "/resource/Item", "Item");
}

export async function PUT(request: NextRequest) {
  return proxyPut(request, "/resource/Item", "item_code", "Item");
}

export async function DELETE(request: NextRequest) {
  return proxyDelete(request, "/resource/Item", "item_code", "Item");
}
