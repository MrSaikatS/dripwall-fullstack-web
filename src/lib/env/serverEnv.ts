import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_ALLOWED_ORIGINS: z.string().optional(),
    BETTER_AUTH_TELEMETRY: z.string().optional(),
  },
  experimental__runtimeEnv: process.env,
});
