import { NextRequest, NextResponse } from "next/server";
import { assertCsrf, checkRateLimit, jsonError, readJsonBody } from "@/lib/api-security";
import { partnerApiUrl } from "@/lib/partner-api";
import { setPartnerSessionCookies } from "@/lib/partner-session";

type LoginBody = {
  email?: string;
  password?: string;
};

type PartnerLoginResponse = {
  ok?: boolean;
  data?: {
    token?: string;
    refreshToken?: string;
    role?: string;
  };
  message?: string;
};

export async function POST(request: NextRequest) {
  const rateLimitError = checkRateLimit(request, "partner-auth:login", 12);
  if (rateLimitError) return rateLimitError;

  const csrfError = assertCsrf(request);
  if (csrfError) return csrfError;

  const body = await readJsonBody<LoginBody>(request);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return jsonError("Email and password are required.", 422);
  }

  const upstream = await fetch(partnerApiUrl("auth/login"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": request.headers.get("user-agent") ?? "RNB frontend",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  }).catch(() => null);

  if (!upstream) {
    return jsonError("Partner API is unavailable.", 502);
  }

  const payload = (await upstream.json().catch(() => null)) as PartnerLoginResponse | null;
  if (!upstream.ok || !payload?.ok || !payload.data?.token || !payload.data?.refreshToken) {
    return NextResponse.json(
      { ok: false, message: payload?.message ?? "Unable to sign in." },
      { status: upstream.status || 401 },
    );
  }

  if (payload.data.role !== "partner") {
    return jsonError("Partner account is required.", 403);
  }

  const response = NextResponse.json({ ok: true, data: { role: payload.data.role } });
  setPartnerSessionCookies(response, payload);
  return response;
}
