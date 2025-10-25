import "server-only";

import { z } from "zod";

const schema = z.object({
  // General
  environment: z.enum(["development", "stage", "production"]).default("development"),
  logLevel: z.enum(["error", "warn", "info", "debug"]).default("info"),
  logDrainUrl: z.string().default(""),

  // Auth
  githubId: z.string().optional(),
  githubSecret: z.string().optional(),
  googleId: z.string().optional(),
  googleSecret: z.string().optional(),

  // Stripe
  stripeSecretKey: z.string().default(""),
  stripeWebhookSecret: z.string().default(""),
  stripePortalReturnUrl: z.string().default("http://localhost:3000/dashboard"),

  // Redis
  redisHost: z.string().default("localhost"),
  redisPort: z.number().int().positive().default(6379),
  redisPassword: z.string().min(20).optional(),
  redisConfigured: z.boolean().default(false),

  // Turnstile
  turnstileSecretKey: z.string().optional(),
});

const envVars = {
  // General
  environment: process.env.ENVIRONMENT,
  logLevel: process.env.LOG_LEVEL,
  logDrainUrl: process.env.LOG_DRAIN_URL,

  // Auth
  githubId: process.env.AUTH_GITHUB_ID,
  githubSecret: process.env.AUTH_GITHUB_SECRET,
  googleId: process.env.AUTH_GOOGLE_ID,
  googleSecret: process.env.AUTH_GOOGLE_SECRET,

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripePortalReturnUrl: process.env.STRIPE_PORTAL_RETURN_URL,

  // Redis
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT || "6379", 10),
  redisPassword: process.env.REDIS_PASS,
  redisConfigured: Boolean(
    process.env.REDIS_HOST && process.env.REDIS_PORT && process.env.REDIS_PASS
  ),

  // Turnstile
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
};

const conf = schema.parse(envVars);

export default conf;
