import { z } from "zod";

const schema = z.object({
  // Logging
  logDrainUrl: z.string().default(""),
  logLevel: z.enum(["error", "warn", "info", "debug"]).default("info"),

  // Stripe
  stripeSecretKey: z.string().default(""),
  stripeWebhookSecret: z.string().default(""),
  stripePortalReturnUrl: z.string().default("http://localhost:3000/dashboard"),

  // General
  frontendUrl: z.string().default("http://localhost:3000"),
  environment: z.enum(["development", "stage", "production"]).default("development"),
});

const envVars = {
  // Logging
  logDrainUrl: process.env.LOG_DRAIN_URL,
  logLevel: process.env.LOG_LEVEL,
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripePortalReturnUrl: process.env.STRIPE_PORTAL_RETURN_URL,
  // General
  frontendUrl: process.env.FRONTEND_URL,
  environment: process.env.ENVIRONMENT,
};

const conf = schema.parse(envVars);

export default conf;
