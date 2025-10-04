import type Stripe from "stripe";
import conf from "@/lib/config";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  if (!conf.stripeSecretKey || !conf.stripeWebhookSecret) {
    return new Response("Not implemented", { status: 501 });
  }
  const stripe = (await import("@/lib/stripe")).stripe;

  const sig = req.headers.get("stripe-signature") || "";

  // biome-ignore lint/suspicious/noImplicitAnyLet: TODO: Need further investigation
  let event;

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
    // Handle various event types
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
