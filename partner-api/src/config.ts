import "dotenv/config";

const weakJwtSecrets = new Set(["", "dev-secret", "change-me-in-production"]);

export const config = {
  port: Number(process.env.PORT || 4100),
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  uploadDir: process.env.UPLOAD_DIR || "storage/uploads",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
};

if (process.env.NODE_ENV === "production") {
  if (weakJwtSecrets.has(config.jwtSecret) || config.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be set to a strong production secret.");
  }

  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required in production.");
  }
}