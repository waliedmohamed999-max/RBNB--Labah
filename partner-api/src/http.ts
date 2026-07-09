import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { logger } from "./logger.js";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function validate<T extends z.ZodTypeAny>(schema: T) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!parsed.success) {
      return next(new HttpError(422, parsed.error.issues[0]?.message || "Invalid request."));
    }

    request.validated = parsed.data;
    return next();
  };
}

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    return response.status(error.status).json({ ok: false, message: error.message });
  }

  logger.error("Unhandled API error", { error: error instanceof Error ? error.message : String(error) });
  return response.status(500).json({ ok: false, message: "Unexpected server error." });
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "admin" | "partner";
        partnerId?: string;
        permissions: string[];
      };
      validated?: unknown;
    }
  }
}

