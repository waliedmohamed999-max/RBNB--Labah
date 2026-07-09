import { Router } from "express";
import { z } from "zod";
import { requireAuth, requirePermission, requireRole } from "../auth.js";
import { query } from "../db.js";
import { HttpError, validate } from "../http.js";

export const servicesRouter = Router();

const serviceSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(180),
    serviceType: z.enum(["homes", "hotels", "events", "conferences", "parties", "experiences"]),
    city: z.string().min(2).max(80),
    basePrice: z.coerce.number().min(0).max(10_000_000).default(0),
    status: z.enum(["draft", "published", "paused", "archived"]).default("draft"),
  }),
});

servicesRouter.use(requireAuth, requireRole("partner"));

servicesRouter.get("/", requirePermission("manage_services"), async (request, response, next) => {
  try {
    const result = await query(
      "SELECT * FROM services WHERE partner_id = $1 ORDER BY created_at DESC LIMIT 100",
      [request.user?.partnerId],
    );
    response.json({ ok: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

servicesRouter.post("/", requirePermission("create_service"), validate(serviceSchema), async (request, response, next) => {
  try {
    const partnerId = request.user?.partnerId;
    if (!partnerId) throw new HttpError(404, "Partner profile not found.");

    const body = (request.validated as z.infer<typeof serviceSchema>).body;
    const result = await query(
      `INSERT INTO services (partner_id, title, service_type, city, base_price, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [partnerId, body.title, body.serviceType, body.city, body.basePrice, body.status],
    );

    response.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
