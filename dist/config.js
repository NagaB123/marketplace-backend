"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const configSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]),
    PORT: zod_1.z.coerce.number().int().positive(),
    FAKE_STORE_API_BASE_URL: zod_1.z.string().url(),
    UPSTREAM_TIMEOUT_MS: zod_1.z.coerce.number().int().positive(),
    DATABASE_FILE: zod_1.z.string().min(1)
});
const parsedConfig = configSchema.safeParse(process.env);
if (!parsedConfig.success) {
    throw new Error(`Invalid environment configuration: ${parsedConfig.error.message}`);
}
exports.config = {
    environment: parsedConfig.data.NODE_ENV,
    port: parsedConfig.data.PORT,
    fakeStoreApiBaseUrl: parsedConfig.data.FAKE_STORE_API_BASE_URL.replace(/\/$/, ""),
    upstreamTimeoutMs: parsedConfig.data.UPSTREAM_TIMEOUT_MS,
    databaseFile: parsedConfig.data.DATABASE_FILE
};
