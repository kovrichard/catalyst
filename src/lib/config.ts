import Joi from "joi";

const schema = Joi.object({
  // Logging
  logDrainUrl: Joi.string().default(false),
  logLevel: Joi.string().valid("error", "warn", "info", "debug").default("info"),
  // Stripe
  stripeSecretKey: Joi.string().default(false),
  stripeWebhookSecret: Joi.string().default(false),
  stripePortalReturnUrl: Joi.string().default("http://localhost:3000/dashboard"),
  // General
  frontendUrl: Joi.string().default("http://localhost:3000"),
  environment: Joi.string()
    .valid("development", "stage", "production")
    .default("development"),
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

const { error, value: conf } = schema.validate(envVars);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default conf;
