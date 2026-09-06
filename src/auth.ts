// @catalyst:mcp-start
import { apiKey } from "@better-auth/api-key";
// @catalyst:mcp-end
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
// @catalyst:email-start
import { after } from "next/server";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/aws/ses";
// @catalyst:email-end
import conf from "@/lib/config";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma/prisma";

// @catalyst:stripe-start

import type Stripe from "stripe";
import { createStripeCustomer } from "@/lib/stripe-public";

// @catalyst:stripe-end

// @catalyst:mcp-start
// Better Auth copies these onto the key row when the key is created, so a change
// here only reaches keys minted afterwards — existing keys keep their old limit.
const apiKeyRateLimitWindowMs = 60_000;
const apiKeyRateLimitMaxRequests = 120;
// @catalyst:mcp-end

const passkeyRelyingPartyId = conf.authority.split(":")[0];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // @catalyst:email-start
    sendResetPassword: async ({ user, url }, _request) => {
      after(() =>
        sendResetPasswordEmail({
          to: user.email,
          name: user.name,
          url: url,
        })
      );
    },
    // @catalyst:email-end
    onPasswordReset: async ({ user }, _request) => {
      logger.info(`Password for user ${user.id} has been reset`);
    },
  },
  // @catalyst:email-start
  // Account linking refuses to attach an OAuth identity to an unverified local
  // row, so without this a password signup can never sign in with a provider.
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24,
    sendVerificationEmail: async ({ user, url }, _request) => {
      after(() =>
        sendVerificationEmail({
          to: user.email,
          name: user.name,
          url: url,
        })
      );
    },
  },
  // @catalyst:email-end
  socialProviders: {
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
  // Signed session payload rides in a cookie so getSession answers without a
  // database round-trip. maxAge bounds how long a revoked session stays usable.
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
  plugins: [
    // @catalyst:mcp-start
    apiKey({
      rateLimit: {
        enabled: true,
        timeWindow: apiKeyRateLimitWindowMs,
        maxRequests: apiKeyRateLimitMaxRequests,
      },
    }),
    // @catalyst:mcp-end
    passkey({
      rpID: passkeyRelyingPartyId,
      rpName: "Catalyst",
      origin: conf.host,
    }),
    nextCookies(),
  ],
  user: {
    additionalFields: {
      // Extra user fields go here, e.g. customerId: { type: "string", required: false }
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
