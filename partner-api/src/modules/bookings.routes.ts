import { Router } from "express";
import { z } from "zod";
import { requireAuth, requirePermission, requireRole } from "../auth.js";
import { query } from "../db.js";
import { HttpError, validate } from "../http.js";

export const bookingsRouter = Router();

const createBookingSchema = z.object({
  body: z.object({
    serviceId: z.string().uuid().optional(),
    guestName: z.string().min(2).max(120),
    guestMobile: z.string().min(8).max(24),
    city: z.string().min(2).max(80),
    startsAt: z.string().datetime().optional(),
    totalAmount: z.coerce.number().min(0).max(10_000_000).default(0),
  }),
});

bookingsRouter.use(requireAuth, requireRole("partner"));

bookingsRouter.get("/", requirePermission("view_bookings"), async (request, response, next) => {
  try {
    const result = await query(
      `SELECT b.*, s.title AS service_title, s.service_type
       FROM bookings b
       LEFT JOIN services s ON s.id = b.service_id
       WHERE b.partner_id = $1
       ORDER BY b.created_at DESC
       LIMIT 100`,
      [request.user?.partnerId],
    );
    response.json({ ok: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

bookingsRouter.post("/", requirePermission("view_bookings"), validate(createBookingSchema), async (request, response, next) => {
  try {
    const partnerId = request.user?.partnerId;
    if (!partnerId) throw new HttpError(404, "Partner profile not found.");

    const body = (request.validated as z.infer<typeof createBookingSchema>).body;
    const bookingNumber = `BK-${Date.now().toString(36).toUpperCase()}`;
    const result = await query(
      `INSERT INTO bookings (
        partner_id, service_id, booking_number, guest_name, guest_mobile, city, starts_at, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        partnerId,
        body.serviceId ?? null,
        bookingNumber,
        body.guestName,
        body.guestMobile,
        body.city,
        body.startsAt ?? null,
        body.totalAmount,
      ],
    );

    response.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
