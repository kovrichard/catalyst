import "server-only";

// @catalyst:stripe-start
//import { createStripeBillingPortalUrl } from "@/lib/stripe";
// @catalyst:stripe-end
import { createTRPCRouter } from "@/lib/trpc/init";

// @catalyst:auth-start

import { protectedProcedure } from "@/lib/trpc/init";
// @catalyst:auth-end

export const appRouter = createTRPCRouter({
  // @catalyst:auth-start
  billingPortal: protectedProcedure.query(async (opts) => {
    const _user = opts.ctx.user;
    // @catalyst:stripe-start
    // return createStripeBillingPortalUrl("");
    // @catalyst:stripe-end
    return null;
  }),
  // @catalyst:auth-end
});

export type AppRouter = typeof appRouter;
