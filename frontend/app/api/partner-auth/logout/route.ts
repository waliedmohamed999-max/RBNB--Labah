import { NextRequest, NextResponse } from "next/server";
import { assertCsrf } from "@/lib/api-security";
import { partnerApiUrl } from "@/lib/partner-api";
import { clearPartnerSessionCookies, getPartnerRefreshToken } from "@/lib/partner-session";

export async function POST(request: NextRequest) {
  const csrfError = assertCsrf(request);
  if (csrfError) return csrfError;

  const refreshToken = getPartnerRefreshToken(request);
  if (refreshToken) {
    await fetch(partnerApiUrl("auth/logout"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("user-agent") ?? "RNB frontend",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    }).catch(() => null);
  }

  const response = NextResponse.json({ ok: true });
  clearPartnerSessionCookies(response);
  return response;
}
