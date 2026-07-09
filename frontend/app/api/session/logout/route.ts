import { NextRequest, NextResponse } from "next/server";
import { legacyUrl } from "@/lib/platform";
import { appendHardenedSetCookies, assertCsrf } from "@/lib/api-security";

export async function POST(request: NextRequest) {
  const csrfError = assertCsrf(request);
  if (csrfError) return csrfError;

  const upstream = await fetch(legacyUrl("/bridge/v1/session/logout"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      Cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  const text = await upstream.text();
  const response = new NextResponse(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });

  appendHardenedSetCookies(response, upstream);
  response.cookies.delete("labayh_csrf");
  return response;
}
