import { config as loadDotenv } from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

for (const candidate of [
  join(process.cwd(), ".env"),
  join(process.cwd(), "backend", ".env"),
]) {
  if (existsSync(candidate)) {
    loadDotenv({ path: candidate });
    break;
  }
}

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(7000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  GEMINI_MODEL: z.string().default("gemini-flash-latest"),

  ALLOW_PRIVATE_NETWORK_TARGETS: z
    .string()
    .default("false")
    .transform((v) => v === "true"),

  CRAWL_MAX_PAGES: z.coerce.number().int().positive().default(8),
  FETCH_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  CRAWL_DELAY_MS: z.coerce.number().int().nonnegative().default(500),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120),

  EVALUATE_CONCURRENCY: z.coerce.number().int().positive().default(2),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast: a misconfigured environment should never start the server or the CLI.
  console.error(
    "Invalid environment configuration:",
    z.prettifyError(parsed.error),
  );
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
