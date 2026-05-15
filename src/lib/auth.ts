import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { hashPasswordFunction, verifyPasswordFunction } from "./argon2";
import prisma from "./database/dbClient";
import { serverEnv } from "./env/serverEnv";

export const auth = betterAuth({
  secret: serverEnv.BETTER_AUTH_SECRET,

  baseURL: serverEnv.BETTER_AUTH_URL,

  trustedOrigins:
    serverEnv.BETTER_AUTH_ALLOWED_ORIGINS?.split(",").filter(Boolean) ??
    undefined,

  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),

  plugins: [nextCookies()],

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // Todo: enable email verification
    requireEmailVerification: false,
    password: {
      hash: hashPasswordFunction,
      verify: verifyPasswordFunction,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  advanced: {
    cookiePrefix: "cit",
    useSecureCookies: process.env.NODE_ENV === "production",
    database: {
      generateId: false,
    },
  },

  rateLimit: {
    window: 60, // Default: 1 minute
    max: 25, // Default: 25 requests per minute (increased from 10)
    customRules: {
      "/sign-in/*": {
        window: 300, // 5 minutes
        max: 10, // 10 login attempts
      },
      "/sign-up/*": {
        window: 600, // 10 minutes
        max: 5, // 5 registration attempts
      },
      "/reset-password/*": {
        window: 900, // 15 minutes
        max: 3, // 3 reset attempts
      },
      "/get-session": {
        window: 60,
        max: 60, // Allow frequent session checks
      },
    },
  },
});
