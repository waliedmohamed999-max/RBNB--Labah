import type { NextRequest } from "next/server";
import type { BridgeSessionUser } from "./api";

export const LOCAL_ADMIN_COOKIE = "labayh_vercel_admin";

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function encodeLocalAdminSession(session: unknown): string {
  return encodeBase64Url(JSON.stringify(session));
}

function decodeSessionCookieValue(raw: string): Set<string> {
  const candidates = new Set<string>([raw]);
  let decoded = raw;

  for (let index = 0; index < 3; index += 1) {
    try {
      decoded = decodeURIComponent(decoded);
      candidates.add(decoded);
    } catch {
      break;
    }
  }

  for (const candidate of Array.from(candidates)) {
    try {
      candidates.add(decodeBase64Url(candidate));
    } catch {
      // Keep trying the remaining formats.
    }
  }

  return candidates;
}

function parseSessionCandidate(value: string): BridgeSessionUser | null {
  try {
    const session = JSON.parse(value) as BridgeSessionUser;
    const roles = Array.isArray(session.roles) ? session.roles : [];
    return roles.length > 0 ? session : null;
  } catch {
    return null;
  }
}

export function readLocalAdminSessionFromValue(raw?: string): BridgeSessionUser | null {
  if (!raw) {
    return null;
  }

  for (const candidate of decodeSessionCookieValue(raw)) {
    const session = parseSessionCandidate(candidate);
    if (session) {
      return session;
    }
  }

  return null;
}

export function readLocalAdminSessionFromRequest(request: NextRequest): BridgeSessionUser | null {
  return readLocalAdminSessionFromValue(request.cookies.get(LOCAL_ADMIN_COOKIE)?.value);
}

function getCookieValue(cookieHeader: string, name: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function readLocalAdminSessionFromHeader(cookieHeader?: string): BridgeSessionUser | null {
  if (!cookieHeader) {
    return null;
  }

  return readLocalAdminSessionFromValue(getCookieValue(cookieHeader, LOCAL_ADMIN_COOKIE));
}
