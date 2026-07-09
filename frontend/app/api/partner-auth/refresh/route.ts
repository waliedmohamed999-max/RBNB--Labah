import { NextRequest, NextResponse } from "next/server";
import { assertCsrf, jsonError } from "@/lib/api-security";
import { refreshPartnerSession, setPartnerSessionCookies } from "@/lib/partner-session";

export async function POST(request: NextRequest) {
  const csrfError = assertCsrf(request);
  if (csrfError) return csrfError;

  const payload = await refreshPartnerSession(request);
  if (!payload) {
    return jsonError("Authentication required.", 401);
  }

  const response = NextResponse.json({ ok: true, data: { role: payload.data?.role } });
  setPartnerSessionCookies(response, payload);
  return response;
}
