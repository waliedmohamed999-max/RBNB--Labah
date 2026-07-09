import { Router } from "express";
import { requireAuth, requireRole } from "../auth.js";
import { query } from "../db.js";
import { HttpError } from "../http.js";

export const partnerRouter = Router();

partnerRouter.use(requireAuth, requireRole("partner"));

partnerRouter.get("/dashboard", async (request, response, next) => {
  try {
    const partnerId = request.user?.partnerId;
    if (!partnerId) throw new HttpError(404, "Partner profile not found.");

    const [bookings, services, invoices, partner] = await Promise.all([
      query<{ total: string; active: string; completed: string }>(
        `SELECT
          COUNT(*)::text AS total,
          COUNT(*) FILTER (WHERE status IN ('pending', 'confirmed', 'checked_in'))::text AS active,
          COUNT(*) FILTER (WHERE status = 'completed')::text AS completed
        FROM bookings WHERE partner_id = $1`,
        [partnerId],
      ),
      query<{ total: string; published: string }>(
        `SELECT
          COUNT(*)::text AS total,
          COUNT(*) FILTER (WHERE status = 'published')::text AS published
        FROM services WHERE partner_id = $1`,
        [partnerId],
      ),
      query<{ total: string }>("SELECT COALESCE(SUM(amount), 0)::text AS total FROM invoices WHERE partner_id = $1", [partnerId]),
      query<{ balance: string; company_name: string }>("SELECT balance::text, company_name FROM partners WHERE id = $1", [partnerId]),
    ]);

    response.json({
      ok: true,
      data: {
        companyName: partner.rows[0].company_name,
        balance: Number(partner.rows[0].balance),
        bookings: {
          total: Number(bookings.rows[0].total),
          active: Number(bookings.rows[0].active),
          completed: Number(bookings.rows[0].completed),
        },
        services: {
          total: Number(services.rows[0].total),
          published: Number(services.rows[0].published),
        },
        invoicesTotal: Number(invoices.rows[0].total),
      },
    });
  } catch (error) {
    next(error);
  }
});

partnerRouter.get("/me", async (request, response, next) => {
  try {
    const partnerId = request.user?.partnerId;
    const result = await query(
      `SELECT p.*, ps.enabled_features, ps.commission_rules, ps.allowed_cities, ps.service_types,
        COALESCE(
          jsonb_object_agg(pp.permission_key, pp.enabled)
          FILTER (WHERE pp.permission_key IS NOT NULL),
          '{}'::jsonb
        ) AS permissions
       FROM partners p
       LEFT JOIN partner_settings ps ON ps.partner_id = p.id
       LEFT JOIN partner_permissions pp ON pp.partner_id = p.id
       WHERE p.id = $1
       GROUP BY p.id, ps.partner_id, ps.enabled_features, ps.commission_rules, ps.allowed_cities, ps.service_types`,
      [partnerId],
    );
    response.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
