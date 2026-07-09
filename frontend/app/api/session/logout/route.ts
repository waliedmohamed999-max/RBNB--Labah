import { NextRequest, NextResponse } from "next/server";
import { legacyUrl } from "@/lib/platform";
import { appendHardenedSetCookies, assertCsrf } from "@/lib/api-security";

export async function POST(request: NextRequest) {
  const csrfError = assertCsrf(request);
  if (csrfError) return csrfError;

  let response: NextResponse;

  try {
    const upstream = await fetch(legacyUrl("/bridge/v1/session/logout"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    response = new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
      },
    });

    appendHardenedSetCookies(response, upstream);
  } catch {
    response = NextResponse.json({ status: 1, message: "تم تسجيل الخروج." });
  }

  response.cookies.delete("labayh_csrf");
  response.cookies.delete("labayh_vercel_admin");
  return response;
}