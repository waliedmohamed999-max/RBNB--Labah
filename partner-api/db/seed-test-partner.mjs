// FOR TESTING ONLY. Do not run against production databases.
// Creates a synthetic QA partner with enough linked data to exercise the web partner dashboard.
// The generated password is printed to stdout only and is never stored in this file.

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import pg from "pg";

const TEST_EMAIL = "test-partner@internal-qa.local";
const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/labayh_partners";
const mode = process.argv.includes("--cleanup") ? "cleanup" : "seed";
const client = new pg.Client({ connectionString: DATABASE_URL });

async function cleanup() {
  await client.query("BEGIN");
  try {
    const existing = await client.query("SELECT id FROM users WHERE email = $1", [TEST_EMAIL]);
    for (const row of existing.rows) {
      await client.query("DELETE FROM users WHERE id = $1", [row.id]);
    }
    await client.query("COMMIT");
    return { ok: true, deletedUsers: existing.rowCount, email: TEST_EMAIL };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  }
}

async function seed() {
  const password = process.env.TEST_PARTNER_PASSWORD || `Qa-${crypto.randomBytes(12).toString("base64url")}9!`;
  const passwordHash = await bcrypt.hash(password, 10);

  await client.query("BEGIN");
  try {
    await cleanupExistingInsideTransaction();

    const userResult = await client.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'partner') RETURNING id, email",
      [TEST_EMAIL, passwordHash],
    );
    const user = userResult.rows[0];

    const partnerResult = await client.query(
      `INSERT INTO partners (
        user_id, company_name, manager_name, mobile, city, activity_type,
        expected_monthly_bookings, status, balance, approved_at
      ) VALUES ($1, 'QA Internal Partner', 'QA Tester', '+966500000001', 'Riyadh', 'hospitality', 12, 'approved', 1250.00, now())
      RETURNING id, company_name`,
      [user.id],
    );
    const partner = partnerResult.rows[0];

    await client.query(
      `INSERT INTO partner_settings (partner_id, enabled_features, commission_rules, allowed_cities, service_types)
       VALUES ($1, '{"ads": true, "reports": true}'::jsonb, '{"default": 12}'::jsonb, ARRAY['Riyadh'], ARRAY['hospitality'])`,
      [partner.id],
    );

    await client.query(
      `INSERT INTO partner_permissions (partner_id, permission_key, enabled)
       SELECT $1, key, true FROM permissions
       ON CONFLICT (partner_id, permission_key) DO UPDATE SET enabled = EXCLUDED.enabled`,
      [partner.id],
    );

    const serviceResult = await client.query(
      `INSERT INTO services (partner_id, title, service_type, city, base_price, status)
       VALUES ($1, 'QA Riyadh Chalet', 'hospitality', 'Riyadh', 750.00, 'published')
       RETURNING id, title`,
      [partner.id],
    );
    const service = serviceResult.rows[0];

    const bookingResult = await client.query(
      `INSERT INTO bookings (partner_id, service_id, booking_number, guest_name, guest_mobile, city, starts_at, status, total_amount)
       VALUES ($1, $2, $3, 'QA Guest', '+966500000002', 'Riyadh', now() + interval '3 days', 'confirmed', 750.00)
       RETURNING id, booking_number`,
      [partner.id, service.id, `QA-${Date.now()}`],
    );
    const booking = bookingResult.rows[0];

    const invoiceResult = await client.query(
      `INSERT INTO invoices (partner_id, invoice_number, amount, status, pdf_url)
       VALUES ($1, $2, 750.00, 'paid', '/qa/invoices/sample.pdf')
       RETURNING id, invoice_number`,
      [partner.id, `QA-INV-${Date.now()}`],
    );
    const invoice = invoiceResult.rows[0];

    await client.query("COMMIT");

    return {
      ok: true,
      email: TEST_EMAIL,
      password,
      userId: user.id,
      partnerId: partner.id,
      serviceId: service.id,
      bookingNumber: booking.booking_number,
      invoiceNumber: invoice.invoice_number,
    };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  }
}

async function cleanupExistingInsideTransaction() {
  const existing = await client.query("SELECT id FROM users WHERE email = $1", [TEST_EMAIL]);
  for (const row of existing.rows) {
    await client.query("DELETE FROM users WHERE id = $1", [row.id]);
  }
}

try {
  await client.connect();
  const result = mode === "cleanup" ? await cleanup() : await seed();
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, message: error.message, code: error.code }, null, 2));
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}
