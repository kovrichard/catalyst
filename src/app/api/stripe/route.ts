import type Stripe from "stripe";
import conf from "@/lib/config";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";
import { ensure } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    ensure(stripe, "Stripe is not configured");
  } catch (err) {
    logger.error(err);
    return new Response("Not implemented", { status: 501 });
  }

  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      sig,
      conf.stripeWebhookSecret
    );
    // biome-ignore lint/suspicious/noExplicitAny: TODO: Need further investigation
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "customer.created": {
      const customer = event.data.object as Stripe.Customer;
      logger.info(`Customer created: ${customer.id}`);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      logger.info(`Subscription updated: ${subscription.id}`);
      break;
    }
    default: {
      logger.info(`Unhandled event type: ${event.type}`);
    }
  }

  return new Response("Webhook received", { status: 200 });
}
