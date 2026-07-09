import { NextRequest, NextResponse } from "next/server";
import { assertCsrf, checkRateLimit, isSafeMethod, jsonError } from "@/lib/api-security";
import { partnerApiUrl } from "@/lib/partner-api";
import { partnerAuthHeader, refreshPartnerSession, setPartnerSessionCookies } from "@/lib/partner-session";

const MAX_PARTNER_BODY_BYTES = 12 * 1024 * 1024;

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

async function proxyPartnerApi(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const bodySizeError = assertPartnerBodySize(request);
  if (bodySizeError) return bodySizeError;

  const rateLimitError = checkRateLimit(request, `partner-api:${path.join("/") || "root"}`, isSafeMethod(request.method) ? 120 : 30);
  if (rateLimitError) return rateLimitError;

  const csrfError = assertCsrf(request);
  if (csrfError) return csrfError;

  const upstreamUrl = new URL(partnerApiUrl(path.join("/")));
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));

  const requestBody = isSafeMethod(request.method) ? undefined : await request.arrayBuffer();
  const firstAttempt = await sendPartnerRequest(request, upstreamUrl, requestBody);
  if (!firstAttempt) {
    return jsonError("Partner API is unavailable.", 502);
  }

  if (firstAttempt.status !== 401 || request.headers.get("authorization")) {
    return partnerResponse(firstAttempt);
  }

  const refreshed = await refreshPartnerSession(request);
  if (!refreshed?.data?.token) {
    return partnerResponse(firstAttempt);
  }

  const retry = await sendPartnerRequest(request, upstreamUrl, requestBody, refreshed.data.token);
  if (!retry) {
    return jsonError("Partner API is unavailable.", 502);
  }

  const response = await partnerResponse(retry);
  setPartnerSessionCookies(response, refreshed);
  return response;
}

async function sendPartnerRequest(
  request: NextRequest,
  upstreamUrl: URL,
  body: ArrayBuffer | undefined,
  tokenOverride?: string,
) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const authorization = partnerAuthHeader(request, tokenOverride);

  headers.set("Accept", "application/json");
  if (contentType) headers.set("Content-Type", contentType);
  if (authorization) headers.set("Authorization", authorization);

  return fetch(upstreamUrl, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  }).catch(() => null);
}

async function partnerResponse(upstream: Response) {
  const responseContentType = upstream.headers.get("content-type") ?? "application/json";
  const responseBody = await upstream.text();

  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      "content-type": responseContentType,
      "cache-control": "no-store",
    },
  });
}

function assertPartnerBodySize(request: NextRequest) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > MAX_PARTNER_BODY_BYTES) {
    return jsonError("Request body is too large.", 413);
  }
  return null;
}

export const GET = proxyPartnerApi;
export const POST = proxyPartnerApi;
export const PUT = proxyPartnerApi;
export const PATCH = proxyPartnerApi;
export const DELETE = proxyPartnerApi;
