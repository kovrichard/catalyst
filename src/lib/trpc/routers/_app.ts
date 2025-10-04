import "server-only";

import { createStripeBillingPortalUrl } from "@/lib/stripe";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

export const appRouter = createTRPCRouter({
  billingPortal: protectedProcedure.query(async (opts) => {
    const _user = opts.ctx.user;
    // return createStripeBillingPortalUrl("");
    return null;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
