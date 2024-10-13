import conf from "@/lib/config";
import Stripe from "stripe";

export const stripe = new Stripe(conf.stripeSecretKey, {
  apiVersion: "2024-09-30.acacia",
});
