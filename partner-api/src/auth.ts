import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";
import { query } from "./db.js";
import { HttpError } from "./http.js";

type JwtPayload = {
  sub: string;
  role: "admin" | "partner";
  type?: "access" | "refresh";
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload) {
  return jwt.sign({ ...payload, type: "access" }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"] });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign({ ...payload, type: "refresh" }, config.jwtSecret, { expiresIn: config.jwtRefreshExpiresIn as SignOptions["expiresIn"] });
}

export function hashRefreshToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getTokenExpiresAt(token: string) {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (!decoded?.exp) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return new Date(decoded.exp * 1000);
}

export function verifyRefreshToken(token: string) {
  const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
  if (payload.type !== "refresh") throw new HttpError(401, "Invalid refresh token.");
  return payload;
}

export async function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return next(new HttpError(401, "Authentication required."));

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    if (payload.type === "refresh") throw new HttpError(401, "Access token required.");
    const permissions = await query<{ key: string }>(
      `SELECT pp.permission_key AS key
       FROM partners p
       JOIN partner_permissions pp ON pp.partner_id = p.id
       WHERE p.user_id = $1 AND pp.enabled = true`,
      [payload.sub],
    );
    const partner = await query<{ id: string }>("SELECT id FROM partners WHERE user_id = $1", [payload.sub]);

    request.user = {
      id: payload.sub,
      role: payload.role,
      partnerId: partner.rows[0]?.id,
      permissions: permissions.rows.map((item) => item.key),
    };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid token."));
  }
}

export function requireRole(role: "admin" | "partner") {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (request.user?.role !== role) return next(new HttpError(403, "Permission denied."));
    return next();
  };
}

export function requirePermission(permission: string) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (request.user?.role === "admin" || request.user?.permissions.includes(permission)) return next();
    return next(new HttpError(403, "Permission denied."));
  };
}
