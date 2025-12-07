import "server-only";

import { z } from "zod";

const schema = z.object({
  // General
  environment: z.enum(["development", "stage", "production"]).default("development"),
  logLevel: z.enum(["error", "warn", "info", "debug"]).default("info"),
  logDrainUrl: z.string().default(""),
  scheme: z.string().default("https"),
  authority: z.string().default("localhost:3000"),
  host: z.url(),

  // Auth
  githubId: z.string().optional(),
  githubSecret: z.string().optional(),
  googleId: z.string().optional(),
  googleSecret: z.string().optional(),

  // AWS
  awsRegion: z.string().default("eu-central-1"),
  fromEmailAddress: z.string().optional(),
  awsConfigured: z.boolean().default(false),

  // @catalyst:stripe-start
  // Stripe
  stripeSecretKey: z.string().default(""),
  stripeWebhookSecret: z.string().default(""),
  stripePortalReturnUrl: z.string().default("http://localhost:3000/dashboard"),
  stripeConfigured: z.boolean().default(false),
  // @catalyst:stripe-end

  // @catalyst:redis-start
  // Redis
  redisHost: z.string().default("localhost"),
  redisPort: z.number().int().positive().default(6379),
  redisPassword: z.string().min(20).optional(),
  redisConfigured: z.boolean().default(false),
  // @catalyst:redis-end

  // Turnstile
  turnstileSecretKey: z.string().optional(),
});

const envVars = {
  // General
  environment: process.env.ENVIRONMENT,
  logLevel: process.env.LOG_LEVEL,
  logDrainUrl: process.env.LOG_DRAIN_URL,
  scheme: process.env.SCHEME,
  authority: process.env.AUTHORITY,
  host: `${process.env.SCHEME || "https"}://${process.env.AUTHORITY || "localhost:3000"}`,

  // Auth
  githubId: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_CLIENT_SECRET,
  googleId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_CLIENT_SECRET,

  // AWS
  awsRegion: process.env.AWS_REGION,
  fromEmailAddress: process.env.FROM_EMAIL_ADDRESS,
  awsConfigured:
    process.env.AWS_ACCESS_KEY_ID !== undefined &&
    process.env.AWS_SECRET_ACCESS_KEY !== undefined &&
    process.env.AWS_REGION !== undefined &&
    process.env.FROM_EMAIL_ADDRESS !== undefined,

  // @catalyst:stripe-start
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripePortalReturnUrl: process.env.STRIPE_PORTAL_RETURN_URL,
  stripeConfigured:
    process.env.STRIPE_SECRET_KEY !== undefined &&
    process.env.STRIPE_WEBHOOK_SECRET !== undefined &&
    process.env.STRIPE_PORTAL_RETURN_URL !== undefined,
  // @catalyst:stripe-end

  // @catalyst:redis-start
  // Redis
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT || "6379", 10),
  redisPassword: process.env.REDIS_PASS,
  redisConfigured: Boolean(
    process.env.REDIS_HOST && process.env.REDIS_PORT && process.env.REDIS_PASS
  ),
  // @catalyst:redis-end

  // Turnstile
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
};

const conf = schema.parse(envVars);

export default conf;
