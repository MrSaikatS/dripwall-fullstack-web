import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .startsWith("postgres", {
        error: "DATABASE_URL must start with postgres://",
      })
      .min(1, { error: "DATABASE_URL is required" }),
    CHECKPOINT_DISABLE: z.enum(["1", "0"]).optional(),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, { error: "BETTER_AUTH_SECRET must be at least 32 characters" }),
    BETTER_AUTH_URL: z.url({ error: "BETTER_AUTH_URL must be a valid URL" }),
    BETTER_AUTH_ALLOWED_ORIGINS: z.string().optional(),
    BETTER_AUTH_TELEMETRY: z.string().optional(),
    S3_ENDPOINT: z.url({ error: "S3_ENDPOINT must be a valid URL" }),
    S3_REGION: z.string().default("us-west-004"),
    S3_ACCESS_KEY_ID: z
      .string()
      .min(1, { error: "S3_ACCESS_KEY_ID is required" }),
    S3_SECRET_ACCESS_KEY: z
      .string()
      .min(1, { error: "S3_SECRET_ACCESS_KEY is required" }),
    S3_BUCKET_NAME: z.string().min(1, { error: "S3_BUCKET_NAME is required" }),
    S3_PUBLIC_URL: z.url().optional(),
  },
  experimental__runtimeEnv: process.env,
});
