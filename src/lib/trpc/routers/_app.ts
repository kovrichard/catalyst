import "server-only";

// @catalyst:stripe-start
//import { createStripeBillingPortalUrl } from "@/lib/stripe";
// @catalyst:stripe-end
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

export const appRouter = createTRPCRouter({
  billingPortal: protectedProcedure.query(async (opts) => {
    const _user = opts.ctx.user;
    // @catalyst:stripe-start
    // return createStripeBillingPortalUrl("");
    // @catalyst:stripe-end
    return null;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
