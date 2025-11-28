import { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  return proxyGet(request, "/resource/UOM", "UOM");
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
