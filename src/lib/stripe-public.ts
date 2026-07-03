import type { User } from "better-auth";
import Stripe from "stripe";
import conf from "@/lib/config";
import { logger } from "@/lib/logger";
import { ensure } from "@/lib/utils";

export let stripe: Stripe | null = null;

if (conf.stripeConfigured) {
  stripe = new Stripe(conf.stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
  });
}

export async function createStripeCustomer(user: User): Promise<Stripe.Customer> {
  ensure(stripe, "Stripe is not configured");

  logger.debug(`Creating Stripe customer for user ${user.id}`);

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
      env: conf.environment,
    },
  });
  return customer;
}
