import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendResetPasswordEmail } from "@/lib/aws/ses";
import conf from "@/lib/config";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, _request) => {
      logger.info(`Sending reset password email to user ${user.id}`);
      await sendResetPasswordEmail({
        to: user.email,
        name: user.name,
        url: url,
      });
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

          // let customer: Stripe.Customer | null = null;

          // if (stripeConfigured) {
          //   customer = await createStripeCustomer(user);
          //   await createStripeTrialSubscription(user.id, customer.id);
          // }

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
