import { hashPassword } from "./auth.js";
import { pool, query } from "./db.js";

const adminEmail = (process.env.ADMIN_EMAIL || "admin@labayh.local").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "";

async function seedAdmin() {
  if (adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const passwordHash = await hashPassword(adminPassword);
  const result = await query<{ id: string; email: string }>(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, 'admin')
     ON CONFLICT (email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       role = 'admin'
     RETURNING id, email`,
    [adminEmail, passwordHash],
  );

  console.log(`Admin ready: ${result.rows[0].email}`);
}

seedAdmin()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
