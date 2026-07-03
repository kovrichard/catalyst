import conf from "@/lib/config";
import { getUserFromSession } from "@/lib/services/user.service";
import { ensure } from "@/lib/utils";
import { stripe } from "./stripe-public";

export async function createStripeBillingPortalUrl(customerId: string) {
  ensure(stripe, "Stripe is not configured");

  await getUserFromSession();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: conf.stripePortalReturnUrl,
  });

  return session.url;
}
