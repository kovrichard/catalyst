import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { after } from "next/server";
import { sendResetPasswordEmail } from "@/lib/aws/ses";
import conf from "@/lib/config";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma/prisma";

// @catalyst:stripe-start

import type Stripe from "stripe";
import { createStripeCustomer } from "@/lib/stripe";
// @catalyst:stripe-end

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, _request) => {
      after(
        sendResetPasswordEmail({
          to: user.email,
          name: user.name,
          url: url,
        })
      );
    },
    onPasswordReset: async ({ user }, _request) => {
      logger.info(`Password for user ${user.id} has been reset`);
    },
  },
  socialProviders: {
    github: {
      enabled: Boolean(conf.githubId) && Boolean(conf.githubSecret),
      clientId: conf.githubId || "",
      clientSecret: conf.githubSecret,
    },
    google: {
      enabled: Boolean(conf.googleId) && Boolean(conf.googleSecret),
      clientId: conf.googleId || "",
      clientSecret: conf.googleSecret,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      // Add extra fields to the user here, e.g.
      // customerId: {
      //   type: "string",
      //   required: false,
      // },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          logger.info(`Creating user with id ${user.id}`);

          // @catalyst:stripe-start
          let customer: Stripe.Customer | null = null;

          if (conf.stripeConfigured) {
            customer = await createStripeCustomer(user);
            logger.debug(`Saving customer id ${customer.id} to user ${user.id}`);
          }
          // @catalyst:stripe-end

          // Add custom fields to the user here
          return {
            data: {
              ...user,
              // customerId: customer?.id,
            },
          };
        },
      },
    },
  },
});
