import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../auth.js";
import { pool, query } from "../db.js";
import { validate } from "../http.js";

export const adminRouter = Router();

const partnerIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const statusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ status: z.enum(["approved", "rejected", "suspended"]) }),
});

const permissionsSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    permissions: z.record(z.boolean()),
    allowedCities: z.array(z.string()).default([]),
    serviceTypes: z.array(z.string()).default([]),
    commissionRules: z.record(z.number()).default({}),
    enabledFeatures: z.record(z.boolean()).default({}),
  }),
});

const packageSchema = z.object({
  body: z.object({
    slug: z.string().min(2).max(80).regex(/^[a-z0-9_-]+$/),
    name: z.string().min(2).max(140),
    price: z.coerce.number().min(0).max(1_000_000),
    billingCycle: z.enum(["monthly", "quarterly", "yearly"]).default("monthly"),
    commissionPercent: z.coerce.number().min(0).max(100),
    serviceLimit: z.coerce.number().int().min(0).max(100_000),
    bookingLimit: z.coerce.number().int().min(0).max(10_000_000),
    serviceTypes: z.array(z.string()).default([]),
    permissions: z.record(z.boolean()).default({}),
    features: z.record(z.unknown()).default({}),
    active: z.boolean().default(true),
  }),
});

const assignmentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ packageId: z.string().uuid() }),
});

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/partners", async (_request, response, next) => {
  try {
    const result = await query(
      `SELECT p.*, u.email
       FROM partners p
       JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC`,
    );
    response.json({ ok: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/packages", async (_request, response, next) => {
  try {
    const result = await query(
      `SELECT pp.*,
        COALESCE(
          jsonb_object_agg(ppp.permission_key, ppp.enabled)
          FILTER (WHERE ppp.permission_key IS NOT NULL),
          '{}'::jsonb
        ) AS permissions
       FROM partner_packages pp
       LEFT JOIN partner_package_permissions ppp ON ppp.package_id = pp.id
       GROUP BY pp.id
       ORDER BY pp.price ASC`,
    );
    response.json({ ok: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/packages", validate(packageSchema), async (request, response, next) => {
  const client = await pool.connect();

  try {
    const body = (request.validated as z.infer<typeof packageSchema>).body;
    await client.query("BEGIN");

    const result = await client.query<{ id: string }>(
      `INSERT INTO partner_packages (
        slug, name, price, billing_cycle, commission_percent, service_limit, booking_limit, service_types, features, active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        billing_cycle = EXCLUDED.billing_cycle,
        commission_percent = EXCLUDED.commission_percent,
        service_limit = EXCLUDED.service_limit,
        booking_limit = EXCLUDED.booking_limit,
        service_types = EXCLUDED.service_types,
        features = EXCLUDED.features,
        active = EXCLUDED.active
      RETURNING id`,
      [
        body.slug,
        body.name,
        body.price,
        body.billingCycle,
        body.commissionPercent,
        body.serviceLimit,
        body.bookingLimit,
        body.serviceTypes,
        JSON.stringify(body.features),
        body.active,
      ],
    );

    for (const [key, enabled] of Object.entries(body.permissions)) {
      await client.query(
        `INSERT INTO partner_package_permissions (package_id, permission_key, enabled)
         VALUES ($1, $2, $3)
         ON CONFLICT (package_id, permission_key) DO UPDATE SET enabled = EXCLUDED.enabled`,
        [result.rows[0].id, key, enabled],
      );
    }

    await client.query("COMMIT");
    response.status(201).json({ ok: true, data: { id: result.rows[0].id } });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    next(error);
  } finally {
    client.release();
  }
});

adminRouter.patch("/partners/:id/status", validate(statusSchema), async (request, response, next) => {
  try {
    const { params, body } = request.validated as z.infer<typeof statusSchema>;
    const result = await query(
      `UPDATE partners
       SET status = $2, approved_at = CASE WHEN $2 = 'approved' THEN now() ELSE approved_at END
       WHERE id = $1
       RETURNING *`,
      [params.id, body.status],
    );
    response.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/partners/:id/permissions", validate(partnerIdSchema), async (request, response, next) => {
  try {
    const { params } = request.validated as z.infer<typeof partnerIdSchema>;
    const [permissions, settings] = await Promise.all([
      query("SELECT permission_key, enabled FROM partner_permissions WHERE partner_id = $1", [params.id]),
      query("SELECT * FROM partner_settings WHERE partner_id = $1", [params.id]),
    ]);
    response.json({ ok: true, data: { permissions: permissions.rows, settings: settings.rows[0] } });
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/partners/:id/permissions", validate(permissionsSchema), async (request, response, next) => {
  const client = await pool.connect();

  try {
    const { params, body } = request.validated as z.infer<typeof permissionsSchema>;
    await client.query("BEGIN");

    for (const [key, enabled] of Object.entries(body.permissions)) {
      await client.query(
        `INSERT INTO partner_permissions (partner_id, permission_key, enabled)
         VALUES ($1, $2, $3)
         ON CONFLICT (partner_id, permission_key) DO UPDATE SET enabled = EXCLUDED.enabled`,
        [params.id, key, enabled],
      );
    }

    await client.query(
      `INSERT INTO partner_settings (partner_id, enabled_features, commission_rules, allowed_cities, service_types)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (partner_id) DO UPDATE SET
        enabled_features = EXCLUDED.enabled_features,
        commission_rules = EXCLUDED.commission_rules,
        allowed_cities = EXCLUDED.allowed_cities,
        service_types = EXCLUDED.service_types`,
      [
        params.id,
        JSON.stringify(body.enabledFeatures),
        JSON.stringify(body.commissionRules),
        body.allowedCities,
        body.serviceTypes,
      ],
    );

    await client.query("COMMIT");
    response.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    next(error);
  } finally {
    client.release();
  }
});

adminRouter.put("/partners/:id/package", validate(assignmentSchema), async (request, response, next) => {
  const client = await pool.connect();

  try {
    const { params, body } = request.validated as z.infer<typeof assignmentSchema>;
    await client.query("BEGIN");

    const packageResult = await client.query<{
      id: string;
      service_types: string[];
      features: Record<string, unknown>;
      commission_percent: string;
    }>("SELECT id, service_types, features, commission_percent::text FROM partner_packages WHERE id = $1 AND active = true", [body.packageId]);
    const plan = packageResult.rows[0];

    if (!plan) {
      await client.query("ROLLBACK");
      response.status(404).json({ ok: false, message: "Package not found." });
      return;
    }

    await client.query(
      `INSERT INTO partner_package_assignments (partner_id, package_id, assigned_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (partner_id) DO UPDATE SET
        package_id = EXCLUDED.package_id,
        assigned_by = EXCLUDED.assigned_by,
        assigned_at = now()`,
      [params.id, plan.id, request.user?.id],
    );

    await client.query(
      `INSERT INTO partner_permissions (partner_id, permission_key, enabled)
       SELECT $1, permission_key, enabled
       FROM partner_package_permissions
       WHERE package_id = $2
       ON CONFLICT (partner_id, permission_key) DO UPDATE SET enabled = EXCLUDED.enabled`,
      [params.id, plan.id],
    );

    await client.query(
      `INSERT INTO partner_settings (partner_id, enabled_features, commission_rules, service_types)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (partner_id) DO UPDATE SET
        enabled_features = EXCLUDED.enabled_features,
        commission_rules = EXCLUDED.commission_rules,
        service_types = EXCLUDED.service_types`,
      [
        params.id,
        JSON.stringify(plan.features),
        JSON.stringify({ commissionPercent: Number(plan.commission_percent) }),
        plan.service_types,
      ],
    );

    await client.query("COMMIT");
    response.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    next(error);
  } finally {
    client.release();
  }
});
