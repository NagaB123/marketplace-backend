import "dotenv/config";
import { z } from "zod";

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().positive(),
  FAKE_STORE_API_BASE_URL: z.string().url(),
  UPSTREAM_TIMEOUT_MS: z.coerce.number().int().positive(),
  DATABASE_FILE: z.string().min(1)
});

const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
  throw new Error(`Invalid environment configuration: ${parsedConfig.error.message}`);
}

export const config = {
  environment: parsedConfig.data.NODE_ENV,
  port: parsedConfig.data.PORT,
  fakeStoreApiBaseUrl: parsedConfig.data.FAKE_STORE_API_BASE_URL.replace(/\/$/, ""),
  upstreamTimeoutMs: parsedConfig.data.UPSTREAM_TIMEOUT_MS,
  databaseFile: parsedConfig.data.DATABASE_FILE
};